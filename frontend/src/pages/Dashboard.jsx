import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import TotalExpense from "../components/TotalExpense";
import BudgetProgress from "../components/BudgetProgress";
import CategoryBreakdown from "../components/CategoryBreakdown";
import FinancialInsights from "../components/FinancialInsights";

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH USER PROFILE
  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching profile", error);
      // If profile fetch fails (e.g. invalid token), redirect to login
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // FETCH ALL EXPENSES
  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // RUN WHEN PAGE LOADS
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      await Promise.all([fetchProfile(), fetchExpenses()]);
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container">
        <div style={{ fontSize: 20, fontWeight: 500, color: "var(--text-secondary)" }}>
          Loading your financial space...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar user={user} />

      <main className="dashboard">
        <header style={{ display: "none" }}>
          <h1>Dashboard</h1>
        </header>

        {/* Top visual metrics grid */}
        <section className="stats-grid" aria-label="Visual Financial Metrics">
          <TotalExpense expenses={expenses} />
          <BudgetProgress
            expenses={expenses}
            user={user}
            fetchProfile={fetchProfile}
          />
          <CategoryBreakdown expenses={expenses} />
          <FinancialInsights expenses={expenses} user={user} />
        </section>

        {/* Main working grid */}
        <div className="main-grid">
          <section aria-label="Add New Expense">
            <ExpenseForm fetchExpenses={fetchExpenses} />
          </section>
          <section aria-label="Expense History and Filtering">
            <ExpenseList expenses={expenses} fetchExpenses={fetchExpenses} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;