# Deploying to Google Cloud Run

KejaFinder's `server.ts` is a single Express process that serves the built
SPA (`dist/`), the two Gemini-backed API routes (`/api/chat`,
`/api/insights`), and the Supabase listing-photo sync webhook
(`/webhooks/listing-moderation`). Cloud Run runs that process unchanged in a
container — no serverless-function rewrite needed.

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

`server.ts` needs both the Gemini key and the Supabase server-side
credentials at runtime. Prefer Secret Manager for all of them rather than
plain `--set-env-vars`, since `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS
entirely and `SUPABASE_WEBHOOK_SECRET` authenticates the webhook route:

```bash
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
echo -n "YOUR_SUPABASE_SERVICE_ROLE_KEY" | gcloud secrets create supabase-service-role-key --data-file=-
echo -n "YOUR_SUPABASE_WEBHOOK_SECRET" | gcloud secrets create supabase-webhook-secret --data-file=-

gcloud run deploy kejafinder \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-env-vars SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key:latest \
  --set-secrets SUPABASE_WEBHOOK_SECRET=supabase-webhook-secret:latest
```

- `--source .` builds the `Dockerfile` in this directory via Cloud Build and
  deploys the result — no separate `docker build`/`docker push` step needed.
- `--allow-unauthenticated` is required for a public tenant-facing site (the
  webhook route protects itself separately via the `x-webhook-secret` header
  check, not Cloud Run's own auth).
- `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are client-side and get baked
  into the static bundle at *build* time (`npm run build`), not passed as
  Cloud Run runtime env vars — set them in the environment `npm run build`
  runs in (e.g. a Cloud Build substitution or `.env.production`) before
  deploying.

The command prints a `*.run.app` URL when it finishes — that URL serves the
app, the AI routes, and the webhook route.

## Verifying the deploy

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://YOUR-SERVICE-URL/
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","parts":[{"text":"hello"}]}]}' \
  https://YOUR-SERVICE-URL/api/chat
```

Both should return `200`.

## Supabase Auth/Storage/Postgres

Called directly from the client via `@supabase/supabase-js`, independent of
where `server.ts` runs — RLS policies are the security boundary, not this
server. `server.ts` only touches Supabase for one thing: the
`/webhooks/listing-moderation` route uses the service-role key to move
listing photos between the private `listing-photos-pending` bucket and the
public `listing-photos` bucket when a listing's moderation/availability
status changes.

## Configuring the Database Webhook

In the Supabase Dashboard → Database → Webhooks, create a webhook on
`public.listings` firing on `UPDATE` of `moderation_status` and
`availability_status`, pointed at:

```
https://YOUR-SERVICE-URL/webhooks/listing-moderation
```

with an HTTP header `x-webhook-secret: YOUR_SUPABASE_WEBHOOK_SECRET` matching
the `SUPABASE_WEBHOOK_SECRET` secret configured on the Cloud Run service
above. See `docs/SUPABASE_ARCHITECTURE.md` for the full storage-sync design.

## Redeploying after code changes

Re-run the same `gcloud run deploy` command — Cloud Run builds a new revision
and shifts traffic to it once healthy, with the previous revision kept for
instant rollback (`gcloud run services update-traffic kejafinder --to-revisions REVISION=100`).
