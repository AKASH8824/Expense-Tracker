from fastapi import APIRouter, HTTPException
from models.expense_model import Expense
from database.mongo import expenses_collection
from bson import ObjectId

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@router.get("/")
def get_expenses():
    expenses = []

    for expense in expenses_collection.find():
        expense["id"] = str(expense["_id"])
        del expense["_id"]
        expenses.append(expense)

    return expenses

@router.post("/")
def create_expense(expense: Expense):
    result = expenses_collection.insert_one(expense.model_dump())

    return {
        "message": "Expense created successfully",
        "id": str(result.inserted_id)
    }

@router.put("/{expense_id}")
def update_expense(expense_id: str, expense: Expense):
    result = expenses_collection.update_one(
        {"_id": ObjectId(expense_id)},
        {"$set": expense.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")

    return {"message": "Expense updated successfully"}


@router.delete("/{expense_id}")
def delete_expense(expense_id: str):
    result = expenses_collection.delete_one(
        {"_id": ObjectId(expense_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")

    return {"message": "Expense deleted successfully"}