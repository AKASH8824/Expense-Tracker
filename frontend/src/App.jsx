import { useState, useEffect } from "react";
import "./App.css";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Budgets are stored per month, e.g. { "2026-07": 5000 }
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : {};
  });
  const [budgetInput, setBudgetInput] = useState("");

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const currentMonthLabel = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const setBudgetForMonth = () => {
    const value = Number(budgetInput);
    if (!budgetInput || isNaN(value) || value <= 0) {
      alert("Please enter a valid budget amount");
      return;
    }
    setBudgets({ ...budgets, [currentMonth]: value });
    setBudgetInput("");
  };

  const monthlyBudget = budgets[currentMonth];

  const monthlySpent = expenses
    .filter((e) => e.date && e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const budgetPercentage = monthlyBudget
    ? Math.min((monthlySpent / monthlyBudget) * 100, 999)
    : 0;

  let budgetStatus = "safe";
  let budgetMessage = "You're within budget.";
  if (monthlyBudget) {
    if (budgetPercentage >= 100) {
      budgetStatus = "exceeded";
      budgetMessage = "Budget exceeded! You've spent more than your monthly budget.";
    } else if (budgetPercentage >= 80) {
      budgetStatus = "warning";
      budgetMessage = "Warning: you're close to your monthly budget.";
    }
  }

  const addExpense = () => {
    if (!name || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const expense = {
      name,
      amount,
      category,
      date,
    };

    if (editIndex !== null) {
      const updated = [...expenses];
      updated[editIndex] = expense;
      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, expense]);
    }

    setName("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const editExpense = (index) => {
    setName(expenses[index].name);
    setAmount(expenses[index].amount);
    setCategory(expenses[index].category);
    setDate(expenses[index].date);
    setEditIndex(index);
  };

  const clearExpenses = () => {
    setExpenses([]);
    setEditIndex(null);
  };

  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = {
    labels: expenses.map((e) => e.name),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((e) => Number(e.amount)),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
          "#66bb6a",
          "#ef5350",
        ],
      },
    ],
  };

  const categoryIcons = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛒",
    Bills: "💡",
    Entertainment: "🎬",
    Other: "📦",
  };

  return (
    <div className="container">
      <div className="card">

        <h1>Expense Tracker</h1>

        <input
          type="text"
          placeholder="Search Expense"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="add-btn" onClick={addExpense}>
          {editIndex !== null ? "Update Expense" : "Add Expense"}
        </button>

        <h2>Expense List</h2>

        <ul>
          {filteredExpenses.map((expense, index) => (
            <li key={index}>
              <strong>{expense.name}</strong> - ₹{expense.amount}
              <br />
              {categoryIcons[expense.category]} {expense.category} | {expense.date}
              <br />

              <button
                onClick={() => editExpense(index)}
                style={{
                  background: "blue",
                  color: "white",
                  marginRight: "10px",
                  marginTop: "8px",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteExpense(index)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h2>Total Expense: ₹{totalExpense}</h2>

        <div className="budget-section">
          <h2 style={{ marginTop: 0 }}>Budget Alerts — {currentMonthLabel}</h2>

          <div className="budget-row">
            <input
              type="number"
              placeholder={
                monthlyBudget
                  ? `Update budget (current: ₹${monthlyBudget})`
                  : "Set monthly budget"
              }
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button className="budget-set-btn" onClick={setBudgetForMonth}>
              Set Budget
            </button>
          </div>

          {monthlyBudget ? (
            <div className={`budget-alert ${budgetStatus}`}>
              {budgetStatus === "exceeded" && "🚨 "}
              {budgetStatus === "warning" && "⚠️ "}
              {budgetStatus === "safe" && "✅ "}
              {budgetMessage}
              <div className="budget-meta">
                Spent ₹{monthlySpent} of ₹{monthlyBudget} budget (
                {budgetPercentage.toFixed(0)}%) · Remaining ₹
                {Math.max(monthlyBudget - monthlySpent, 0)}
              </div>
              <div className="budget-progress-track">
                <div
                  className={`budget-progress-fill ${budgetStatus}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p style={{ opacity: 0.85 }}>
              Set a budget above to get alerts when you're close to or over
              your limit.
            </p>
          )}
        </div>

        {expenses.length > 0 && (
          <>
            <h2>Expense Chart</h2>

            <div
              style={{
                width: "320px",
                margin: "20px auto",
              }}
            >
              <Pie data={chartData} />
            </div>
          </>
        )}

        <button
          onClick={clearExpenses}
          style={{
            background: "orange",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>

      </div>
    </div>
  );
}

export default App;