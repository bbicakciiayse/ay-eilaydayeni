# Frontend

React + Vite frontend for the Pricing Intelligence Platform.

## Environment

Create `.env` from `.env.example`:

```bash
VITE_API_URL=http://localhost:8000
```

API calls must use `import.meta.env.VITE_API_URL`; localhost should not be hardcoded in application code.

## Run Locally

```bash
npm install
npm run dev
```

## Deploy

Deploy to Vercel or Netlify and set `VITE_API_URL` to the deployed backend URL.

Suggested settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment: `VITE_API_URL=https://your-backend-domain`
