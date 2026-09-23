# Smart Waste Management Assistant

---

## ⚡ Quick start (this scaffold)

```bash
# 1. AI service
cd ml-model && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app:app --reload --port 8000
# 2. Backend (copy .env.example to .env first; MongoDB must be running)
cd backend && npm install && npm run dev
# 3. Frontend
cd frontend && npm install && npm run dev
```

Register with the email set as `ADMIN_EMAIL` in `.env` to get the admin dashboard.
The AI service uses keyword rules out of the box; replace `predict.py` with a trained model when ready.
