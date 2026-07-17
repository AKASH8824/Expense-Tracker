from fastapi import APIRouter
from database.mongo import budgets_collection, expenses_collection

router = APIRouter(
    prefix="/budget",
    tags=["Budget"]
)

@router.post("/")
def set_budget(data: dict):
    month = data["month"]
    amount = data["amount"]

    budgets_collection.update_one(
        {"month": month},
        {"$set": {"month": month, "amount": amount}},
        upsert=True
    )

    return {"message": "Budget saved successfully"}


@router.get("/alert/{month}")
def budget_alert(month: str):

    budget = budgets_collection.find_one({"month": month})

    if not budget:
        return {"message": "No budget found"}

    expenses = list(expenses_collection.find())

    total = 0

    for expense in expenses:
        if expense["date"].startswith(month):
            total += expense["amount"]

    percentage = (total / budget["amount"]) * 100 if budget["amount"] else 0

    if percentage >= 100:
        status = "Budget Exceeded"
    elif percentage >= 80:
        status = "Warning"
    else:
        status = "Safe"

    return {
        "budget": budget["amount"],
        "spent": total,
        "remaining": budget["amount"] - total,
        "percentage": percentage,
        "status": status
    }