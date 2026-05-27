# Pricing Intelligence App

Deployment-ready monorepo for a pricing intelligence and win/loss prediction web application.

## Structure

- `frontend/` React + Vite application
- `backend/` Python FastAPI application
- `Untitled37.ipynb` original notebook model source

The notebook is intentionally left unchanged. The backend now includes a safe notebook wrapper that loads notebook function definitions without running the notebook's main execution block, so preprocessing, feature engineering, and model logic can be used from FastAPI without editing the notebook.

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Frontend: Vercel or Netlify
- Backend: Render or Railway

Set `VITE_API_URL` in the frontend deployment environment to the deployed backend URL.

### Backend Deployment Notes

Because the backend safely loads the unchanged notebook from the repository root, deploy the backend with the repository root available. The backend service is configured for Railway with the root `Dockerfile` and `railway.json`.

- Builder: Dockerfile
- Dockerfile path: `Dockerfile`
- Environment: `FRONTEND_ORIGIN=https://your-frontend-domain`

For Railway, the root `railway.json` is already configured for the backend service. Create the backend service from the repository root.

### Frontend Deployment Notes

Deploy the `frontend/` folder.

- Build command: `npm run build`
- Publish directory: `dist`
- Environment: `VITE_API_URL=https://your-backend-domain`

For Railway, create a second service from the same GitHub repository and set its root directory to `frontend`. The `frontend/railway.json` file is already configured for this service.

The frontend Railway service is also Dockerfile-based. Set `VITE_API_URL` before deploying because Vite reads this value during the build.

Docker ignore files are included so Railway does not upload local `node_modules`, build output, cached Python files, or saved runtime data into the deployment image.
