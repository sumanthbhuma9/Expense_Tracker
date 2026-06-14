const CategoryBreakdown = ({ expenses }) => {
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category
  const categoriesMap = expenses.reduce((acc, curr) => {
    const cat = curr.category.trim().toLowerCase();
    const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
    acc[formattedCat] = (acc[formattedCat] || 0) + curr.amount;
    return acc;
  }, {});

  // Convert to array and sort descending
  const categoryData = Object.keys(categoriesMap)
    .map((name) => ({
      name,
      amount: categoriesMap[name],
      percentage: totalSpent > 0 ? (categoriesMap[name] / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Colors list for visual distinction
  const colors = ["#06b6d4", "#0d9488", "#f97316", "#ec4899", "#84cc16", "#eab308", "#64748b"];

  return (
    <div className="glass-card primary-highlight">
      <div className="stat-header">
        <h3>Category Breakdown</h3>
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
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>
      </div>

      <div className="category-bars-list">
        {categoryData.length === 0 ? (
          <p className="no-data-text" style={{ padding: "20px 0" }}>
            Add expenses to see breakdown
          </p>
        ) : (
          categoryData.slice(0, 5).map((item, index) => {
            const color = colors[index % colors.length];
            return (
              <div className="category-bar-item" key={item.name}>
                <div className="category-bar-info">
                  <span className="category-bar-name">{item.name}</span>
                  <span className="category-bar-amount">
                    ₹ {item.amount} ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="category-bar-bg">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
