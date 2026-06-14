import { useState } from "react";
import API from "../services/api";

const BudgetProgress = ({ expenses, user, fetchProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(user?.budget || 10000);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const budget = user?.budget || 10000;
  const percentage = Math.min((totalSpent / budget) * 100, 100);

  // Dynamic progress bar color based on usage percentage
  let progressColor = "#06b6d4"; // Teal/Cyan (safe)
  if (percentage >= 90) {
    progressColor = "#ff3366"; // Neon Rose (over-budget)
  } else if (percentage >= 70) {
    progressColor = "#f97316"; // Sunset Coral (caution)
  }

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!newBudget || isNaN(newBudget) || Number(newBudget) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await API.put("/auth/budget", { budget: Number(newBudget) });
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card success-highlight">
      <div className="stat-header">
        <h3>Monthly Budget Progress</h3>
        <div className="stat-icon success">
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
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </div>
      </div>

      <div className="stat-value">
        {percentage.toFixed(0)}%
      </div>

      <div className="budget-progress-container">
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>

        <div className="budget-meta">
          <span>Spent: ₹ {totalSpent}</span>
          <span>Budget: ₹ {budget}</span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateBudget} className="inline-budget-form">
          <input
            id="budget-input"
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            placeholder="New Budget"
            min="1"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            Cancel
          </button>
          {error && <div className="alert-banner" style={{ marginTop: 8, padding: 6 }}>{error}</div>}
        </form>
      ) : (
        <button
          id="edit-budget-btn"
          className="edit-budget-btn"
          onClick={() => {
            setNewBudget(budget);
            setIsEditing(true);
          }}
        >
          Edit Budget Limit
        </button>
      )}
    </div>
  );
};

export default BudgetProgress;
