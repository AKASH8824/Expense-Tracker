from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.expense_routes import router as expense_router
from routes.budget_routes import router as budget_router

app = FastAPI(
    title="Expense Tracker API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expense_router)
app.include_router(budget_router)

@app.get("/")
def home():
    return {
        "message": "Expense Tracker API is running successfully!"
    }
