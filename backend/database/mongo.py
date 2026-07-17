from pymongo import MongoClient
from models.expense_model import Expense
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["expense_tracker"]
expenses_collection = db["expenses"]
budgets_collection = db["budgets"]

print("✅ MongoDB Connected Successfully")