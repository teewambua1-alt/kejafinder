# Deploying to Google Cloud Run

KejaFinder's `server.ts` is a single Express process that serves the built
SPA (`dist/`) and the two Gemini-backed API routes (`/api/chat`,
`/api/insights`). Cloud Run runs that process unchanged in a container — no
serverless-function rewrite needed.

## Prerequisites

- A Google Cloud project dedicated to this app (do not deploy into an
  unrelated existing project). Note its project ID.
- Billing enabled on that project (Cloud Run's free tier covers light traffic,
  but billing must be enabled to deploy at all).
- `gcloud` CLI authenticated: `gcloud auth login`, then
  `gcloud config set project YOUR_PROJECT_ID`.

## One-time setup

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

## Deploy

From the repo root (the `Dockerfile` added here is picked up automatically):

```bash
gcloud run deploy kejafinder \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-env-vars GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

- `--source .` builds the `Dockerfile` in this directory via Cloud Build and
  deploys the result — no separate `docker build`/`docker push` step needed.
- `--allow-unauthenticated` is required for a public tenant-facing site.
- Prefer a Secret Manager reference over a plain `--set-env-vars` for
  `GEMINI_API_KEY` once this goes beyond testing:
  ```bash
  echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
  gcloud run deploy kejafinder --source . --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars NODE_ENV=production \
    --set-secrets GEMINI_API_KEY=gemini-api-key:latest
  ```

The command prints a `*.run.app` URL when it finishes — that URL serves both
the app and the API routes correctly, which is the thing this deploy target
was chosen to fix (see the production readiness audit's Stage 3 finding:
neither Firebase Hosting nor a default Vercel import could run these routes).

## Verifying the deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-SERVICE-URL/
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","parts":[{"text":"hello"}]}]}' \
  https://YOUR-SERVICE-URL/api/chat
```

Both should return `200`.

## Firestore/Storage/Auth

Unaffected by this change — those are still called directly from the client
via the Firebase Web SDK, independent of where `server.ts` runs.

## Firebase Hosting (optional, later)

`firebase.json` still points Firebase Hosting at the static `dist/` folder,
which is now redundant as a deployment target (it would serve stale static
files without the API routes if you ran `firebase deploy --only hosting`).
Once the Cloud Run service above is live and you want a custom domain / CDN in
front of it, replace `firebase.json`'s `hosting.public` static config with a
`run` rewrite instead, e.g.:

```json
{
  "hosting": {
    "rewrites": [
      { "source": "**", "run": { "serviceId": "kejafinder", "region": "us-central1" } }
    ]
  }
}
```

This is optional — the plain `*.run.app` URL from `gcloud run deploy` above is
a fully working production URL on its own.

## Redeploying after code changes

Re-run the same `gcloud run deploy` command — Cloud Run builds a new revision
and shifts traffic to it once healthy, with the previous revision kept for
instant rollback (`gcloud run services update-traffic kejafinder --to-revisions REVISION=100`).
