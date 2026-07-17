[README.md](https://github.com/user-attachments/files/30114009/README.md)
# Expense Tracker

A full-stack expense tracker with monthly budget alerts.

- **Frontend:** React + Vite, Chart.js for spending breakdown
- **Backend:** FastAPI + MongoDB (for expense/budget APIs)

> **Note:** Expenses and budgets are currently stored in the browser (`localStorage`), so the app works fully offline without the backend running. The backend exposes a matching REST API (expenses + budget alerts) for anyone who wants to wire the frontend up to MongoDB instead.

## Features

- Add, edit, delete, and search expenses
- Category tags with icons (Food, Travel, Shopping, Bills, Entertainment, Other)
- Pie chart breakdown of spending
- **Budget alerts:** set a monthly budget and get a live status —
  - ✅ Safe (under 80% spent)
  - ⚠️ Warning (80–99% spent)
  - 🚨 Exceeded (100%+ spent)

## Project Structure

```
Office Project/
├── backend/          FastAPI + MongoDB API
│   ├── main.py
│   ├── database/     MongoDB connection
│   ├── models/       Pydantic models
│   └── routes/       /expenses and /budget endpoints
└── frontend/         React + Vite app
    └── src/
        ├── App.jsx    Main UI (expenses + budget alerts)
        └── api.js     Axios client for the backend API
```

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `backend/.env` file (see `backend/.env.example`) with:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the server:

```bash
py -m uvicorn main:app --reload
```

- API root: http://127.0.0.1:8000
- Interactive docs (Swagger UI): http://127.0.0.1:8000/docs

**Endpoints**

| Method | Endpoint              | Description                          |
|--------|------------------------|---------------------------------------|
| GET    | `/expenses/`           | List all expenses                    |
| POST   | `/expenses/`           | Create an expense                    |
| PUT    | `/expenses/{id}`       | Update an expense                    |
| DELETE | `/expenses/{id}`       | Delete an expense                    |
| POST   | `/budget/`             | Set the budget for a month           |
| GET    | `/budget/alert/{month}`| Get budget status for a month (`YYYY-MM`) |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App runs at: http://localhost:5173

To build for production:

```bash
npm run build
```

## Security Note

`backend/.env` holds your MongoDB credentials and is **gitignored** — never commit it. Use `backend/.env.example` as a template when setting up on a new machine.

## Tech Stack

- React 19, Vite, Chart.js / react-chartjs-2, Axios
- FastAPI, Motor / PyMongo, Pydantic, python-dotenv
- MongoDB
