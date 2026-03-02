# QMS Lite Sign Setup

## 1. GitHub App Configuration

App name: `QMS Lite Sign`

Required permissions:
- Repository permissions:
  - Issues: Read and write
  - Pull requests: Read and write
  - Contents: Read and write
  - Metadata: Read-only

OAuth settings:
- Homepage URL: `https://sign.qms.dearauditor.ch`
- Callback URL: `https://sign.qms.dearauditor.ch/auth/callback`

Install app on:
- `AliakseiT/qms-lite`
- `AliakseiT/qms-records` (if records publication moves to app token later)

## 2. Cloudflare Worker Secrets

Set in worker settings:
- `GITHUB_APP_ID`
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`
- `GITHUB_APP_PRIVATE_KEY`
- `SIGNATURE_LINK_SECRET`
- `SIGNATURE_STATE_SECRET`
- Optional: `GITHUB_APP_INSTALLATION_ID`

Worker vars:
- `PUBLIC_BASE_URL=https://sign.qms.dearauditor.ch`
- `DEFAULT_OAUTH_PROVIDER=github`
- `ALLOWED_OAUTH_PROVIDERS=github`

## 3. qms-lite Repository Settings

Repository variable:
- `SIGNATURE_UI_BASE_URL=https://sign.qms.dearauditor.ch`

Repository secrets:
- `SIGNATURE_LINK_SECRET` (must match worker secret)
- `SIGNATURE_APP_ID`
- `SIGNATURE_APP_PRIVATE_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 4. Deploy

Manual:
- `cd services/signature-worker`
- `npm install`
- `npm run deploy`

CI:
- merge to `main` changes under `services/signature-worker/**`
- workflow `Deploy Signature Worker` deploys automatically
