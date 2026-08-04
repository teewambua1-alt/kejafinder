import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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
