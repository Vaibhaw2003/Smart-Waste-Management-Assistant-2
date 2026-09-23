from fastapi import FastAPI
from pydantic import BaseModel
from predict import analyze

app = FastAPI(title="Smart Waste AI Service")

class Msg(BaseModel):
    message: str

@app.post("/analyze")
def analyze_message(m: Msg):
    return analyze(m.message)

@app.get("/health")
def health():
    return {"ok": True}
