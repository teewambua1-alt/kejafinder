import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";

// Two buckets keep draft/pending listing photos private and approved-listing
// photos genuinely public and CDN-cacheable (see supabase/migrations/
// ..._storage.sql). This server — already deployed on Cloud Run — is the
// trusted process that moves files between them in response to a Supabase
// Database Webhook fired on listings moderation/availability changes, using
// the service role key (never exposed to the client).
const PENDING_BUCKET = "listing-photos-pending";
const PUBLIC_BUCKET = "listing-photos";

const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

async function moveListingPhotos(listingId: string, fromBucket: string, toBucket: string) {
  if (!supabaseAdmin) return;

  const { data: files, error: listError } = await supabaseAdmin.storage.from(fromBucket).list(listingId);
  if (listError) {
    console.error(`Error listing photos for ${listingId} in ${fromBucket}:`, listError);
    return;
  }
  if (!files || files.length === 0) return;

  for (const file of files) {
    const path = `${listingId}/${file.name}`;

    const { data: blob, error: downloadError } = await supabaseAdmin.storage.from(fromBucket).download(path);
    if (downloadError || !blob) {
      console.error(`Error downloading ${path} from ${fromBucket}:`, downloadError);
      continue;
    }

    const { error: uploadError } = await supabaseAdmin.storage.from(toBucket).upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true,
    });
    if (uploadError) {
      console.error(`Error uploading ${path} to ${toBucket}:`, uploadError);
      continue;
    }

    const { error: removeError } = await supabaseAdmin.storage.from(fromBucket).remove([path]);
    if (removeError) {
      console.error(`Error removing ${path} from ${fromBucket} after copy:`, removeError);
    }
  }
}

async function startServer() {
  const app = express();
  // Cloud Run injects PORT (typically 8080) and expects the container to
  // listen on it; 3000 remains the local-dev default.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Both routes proxy to a paid, per-request-billed Gemini API with no
  // per-user auth in front of them, so an IP-based cap is the backstop
  // against a runaway bill from a script (or a bug) hammering the endpoint.
  const aiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many AI requests from this device. Please try again in a few minutes." },
  });

  // API routes FIRST
  app.post("/api/chat", aiRateLimit, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: messages,
        config: {
          systemInstruction: "You are KejaFinder's AI Real Estate Assistant. You are friendly, helpful, and knowledgeable about real estate, apartments, and locations in Kenya (especially Nairobi). Use Google Maps tools when asked about locations, distances, or neighborhoods.",
          tools: [{ googleMaps: {} }],
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during chat generation." });
    }
  });

  app.post("/api/insights", aiRateLimit, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { location } = req.body;
      if (!location) {
        return res.status(400).json({ error: "Location is required." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Provide a short, 3-4 sentence summary of the neighborhood "${location}" focusing on amenities like schools, markets, public transport access, and general safety. Keep it objective and informative.` }]
          }
        ],
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during insights generation." });
    }
  });

  app.post("/webhooks/listing-moderation", async (req, res) => {
    try {
      const secret = process.env.SUPABASE_WEBHOOK_SECRET;
      if (!secret || req.header("x-webhook-secret") !== secret) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!supabaseAdmin) {
        return res.status(500).json({ error: "Supabase admin client is not configured on this server." });
      }

      const record = req.body?.record;
      if (!record || !record.id) {
        return res.status(400).json({ error: "Missing listing record in webhook payload." });
      }

      const isPublic = record.moderation_status === "approved"
        && record.availability_status === "available"
        && record.is_available === true;

      if (isPublic) {
        await moveListingPhotos(record.id, PENDING_BUCKET, PUBLIC_BUCKET);
      } else {
        await moveListingPhotos(record.id, PUBLIC_BUCKET, PENDING_BUCKET);
      }

      res.json({ ok: true });
    } catch (error: any) {
      console.error("Listing moderation webhook error:", error);
      res.status(500).json({ error: error.message || "Webhook processing failed." });
    }
  });

  // Vite middleware for development. Imported dynamically so the production
  // bundle never requires `vite` at all — it previously worked in prod only
  // because vite happened to be duplicated into "dependencies" too.
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
