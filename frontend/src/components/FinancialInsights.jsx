import { useMemo } from "react";

const FinancialInsights = ({ expenses, user }) => {
  const budget = user?.budget || 10000;
  
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const insights = useMemo(() => {
    if (expenses.length === 0) {
      return {
        type: "info",
        title: "Fresh Financial Space",
        message: "Add some transactions above to generate custom saving insights and budget warnings.",
        tip: "Pre-set a realistic budget limit to receive alerts when your spending hits critical thresholds.",
      };
    }

    const budgetRatio = totalSpent / budget;

    // Check budget threshold alerts
    if (budgetRatio >= 1.0) {
      return {
        type: "danger",
        title: "Budget Exceeded",
        message: `You have spent ₹ ${totalSpent.toLocaleString("en-IN")} which is over your ₹ ${budget.toLocaleString("en-IN")} limit!`,
        tip: "Consider pausing all non-essential shopping and subscription accounts for the rest of the month.",
      };
    } else if (budgetRatio >= 0.8) {
      return {
        type: "warning",
        title: "Approaching Limit",
        message: `You have used ${(budgetRatio * 100).toFixed(0)}% of your monthly budget.`,
        tip: "Try postponing major purchases until next month to stay within your threshold limits.",
      };
    }

    // Find highest spending category
    const categoryTotals = expenses.reduce((acc, curr) => {
      const cat = curr.category.trim().toLowerCase();
      const formatted = cat.charAt(0).toUpperCase() + cat.slice(1);
      acc[formatted] = (acc[formatted] || 0) + curr.amount;
      return acc;
    }, {});

    let peakCategory = "";
    let peakAmount = 0;
    Object.keys(categoryTotals).forEach((cat) => {
      if (categoryTotals[cat] > peakAmount) {
        peakAmount = categoryTotals[cat];
        peakCategory = cat;
      }
    });

    if (peakCategory && peakAmount > totalSpent * 0.3) {
      return {
        type: "category",
        title: `Highest Expense: ${peakCategory}`,
        message: `${peakCategory} spending accounts for ${(
          (peakAmount / totalSpent) *
          100
        ).toFixed(0)}% of your overall transactions (₹ ${peakAmount.toLocaleString("en-IN")}).`,
        tip: `Planning purchases in the ${peakCategory} category ahead of time can cut costs by 10% to 15%.`,
      };
    }

    return {
      type: "success",
      title: "Healthy Wallet Status",
      message: "Outstanding job! Your monthly spending is under 80% of your budget goal.",
      tip: "Put your remaining cash directly into a high-yield savings account or investments.",
    };
  }, [expenses, totalSpent, budget]);

  // Determine icon & highlights based on insight type
  let accentClass = "primary-highlight";
  let iconColor = "#0f4c3a";
  let iconSvg = (
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  if (insights.type === "danger") {
    accentClass = "danger-highlight";
    iconColor = "#b8142c";
    iconSvg = (
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
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  } else if (insights.type === "warning") {
    accentClass = "success-highlight"; // terracotta highlight
    iconColor = "#c2593f";
    iconSvg = (
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
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }

  return (
    <div className={`glass-card ${accentClass}`}>
      <div className="stat-header">
        <h3>Smart Saving Insights</h3>
        <div
          className="stat-icon"
          style={{
            background: `${iconColor}15`,
            color: iconColor,
          }}
        >
          {iconSvg}
        </div>
      </div>

      <div
        style={{
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <h4 style={{ fontSize: "16px", fontWeight: "700", color: iconColor }}>
          {insights.title}
        </h4>
        <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: "1.4" }}>
          {insights.message}
        </p>
        <div
          style={{
            background: "#fafaf9",
            borderLeft: `3px solid ${iconColor}`,
            padding: "10px 14px",
            borderRadius: "4px 8px 8px 4px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: "1.4",
            fontStyle: "italic",
          }}
        >
          <strong>Saving Tip:</strong> {insights.tip}
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;
