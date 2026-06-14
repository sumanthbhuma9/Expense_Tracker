const TotalExpense = ({ expenses }) => {
  const total = expenses.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  return (
    <div className="glass-card danger-highlight">
      <div className="stat-header">
        <h3>Total Monthly Spend</h3>
        <div className="stat-icon primary">
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
        ₹ {total.toLocaleString("en-IN")}
      </div>
    </div>
  );
};

export default TotalExpense;