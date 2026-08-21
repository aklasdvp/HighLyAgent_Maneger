"""HighLyAgent Backend - FastAPI Entry Point"""
from fastapi import FastAPI

app = FastAPI(title="HighLyAgent API")

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.4.1"}
