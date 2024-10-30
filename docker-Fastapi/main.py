
from fastapi import FastAPI

app = FastAPI()

# First endpoint: Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI!"}

# Second endpoint: Greeting endpoint with a name parameter
@app.get("/greet/{name}")
async def greet(name: str):
    return {"message": f"Hello, {name}!"}
