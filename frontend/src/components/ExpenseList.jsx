import { useState } from "react";
import API from "../services/api";

const ExpenseList = ({ expenses, fetchExpenses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  // Get unique list of categories dynamically from expenses
  const uniqueCategories = [
    "All",
    ...new Set(
      expenses.map((e) => {
        const cat = e.category.trim();
        return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      })
    ),
  ];

  // Filter expenses based on search term & category selection
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      expense.category.trim().toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-card primary-highlight">
      <h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Expense History
      </h3>

      <div className="list-controls">
        <input
          id="search-input"
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="list-scroll-area">
        {filteredExpenses.length === 0 ? (
          <p className="no-data-text">
            {expenses.length === 0
              ? "No expenses recorded yet."
              : "No matching expenses found."}
          </p>
        ) : (
          filteredExpenses.map((expense) => (
            <div className="expense-item" key={expense._id}>
              <div className="expense-item-info">
                <span className="expense-item-title">{expense.title}</span>
                <div className="expense-item-sub">
                  <span className="expense-category-badge">
                    {expense.category}
                  </span>
                  <span className="expense-item-date">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="expense-item-actions">
                <span className="expense-item-value">
                  ₹ {expense.amount.toLocaleString("en-IN")}
                </span>
                <button
                  id={`delete-btn-${expense._id}`}
                  className="btn-danger"
                  onClick={() => deleteExpense(expense._id)}
                  title="Delete Expense"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;