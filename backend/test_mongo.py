from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

print("Connected successfully!")

db = client["office_db"]
collection = db["employees"]

collection.insert_one({
    "name": "Akash",
    "role": "Python Full Stack Developer"
})

print("Data inserted successfully!")