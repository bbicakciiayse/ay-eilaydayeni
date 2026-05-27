# Backend

FastAPI backend for the Pricing Intelligence Platform.

This backend exposes the planned product workflow and includes a safe notebook wrapper. The notebook file is not edited; its function definitions are loaded without running the notebook's main execution block.

## Environment

Create `.env` from `.env.example`:

```bash
FRONTEND_ORIGIN=http://localhost:5173
```

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Deploy

Deploy to Render or Railway.

Important: the backend wrapper reads `Untitled37.ipynb` from the repository root. Keep the repository root available during backend deployment.

Suggested settings:

- Build command: `cd backend && python -m pip install -r requirements.txt`
- Start command: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment: `FRONTEND_ORIGIN=https://your-frontend-domain`
