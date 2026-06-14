import { useState } from "react";
import API from "../services/api";

const ExpenseForm = ({ fetchExpenses }) => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses/add", expense);

      setExpense({
        title: "",
        amount: "",
        category: "",
        date: "",
      });

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Expense
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="expense-title">Expense Title</label>
          <input
            id="expense-title"
            type="text"
            name="title"
            placeholder="e.g. Grocery shopping"
            value={expense.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-amount">Amount (₹)</label>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            placeholder="0.00"
            value={expense.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-category">Category</label>
          <input
            id="expense-category"
            type="text"
            name="category"
            list="categories-list"
            placeholder="Select or type category"
            value={expense.category}
            onChange={handleChange}
            required
          />
          <datalist id="categories-list">
            <option value="Food" />
            <option value="Shopping" />
            <option value="Entertainment" />
            <option value="Rent" />
            <option value="Bills" />
            <option value="Travel" />
            <option value="Education" />
            <option value="Other" />
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="expense-date">Date</label>
          <input
            id="expense-date"
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>

        <button id="add-expense-submit" type="submit">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;