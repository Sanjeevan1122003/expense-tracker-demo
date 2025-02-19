import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/pagesstyle.css";
import navLogo from "../assets/dashboard_logo.png";
import homeLogo from "../assets/expence_tracker_home_page.png";
import logo from "../assets/Logo.png";

const Dashboard = ({ email }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteIds, setDeleteIds] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    email: email || ""
  });

  // Memoized fetchUserData to prevent re-creation
  const fetchUserData = useCallback(() => {
    axios
      .get(`http://localhost:5000/dashboard?email=${email}`)
      .then((response) => setUserData(response.data))
      .catch(() => setError("Failed to load data."));
  }, [email]);

  const fetchExpenses = useCallback(() => {
    axios
      .get(`http://localhost:5000/get-pdf?email=${email}`)
      .then((res) => {
        console.log("Fetched expenses:", res.data);
        setExpenses(res.data);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses.");
      })
      .finally(() => setLoading(false));
  }, [email]);
  
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
    fetchUserData();
    fetchExpenses();
  }, [email, navigate, fetchUserData, fetchExpenses]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-expense", {
        ...formData,  // Spread existing formData
        email: email, // Ensure email is included in request
      });

      alert(response.data.message || "Expense added successfully!");
      setFormData({ amount: "", category: "", description: "", email: email });
      fetchUserData(); 
      fetchExpenses();// Refresh data
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Try again!");
    }
  };

  const handleDeleteExpense = async (e) => {
    e.preventDefault();

    // Convert input (comma-separated) into an array of numbers
    const idsArray = deleteIds
      .split(",")
      .map(id => id.trim())  // Remove spaces
      .filter(id => id !== ""); // Remove empty values

    if (idsArray.length === 0) {
      alert("Please enter at least one valid expense ID.");
      return;
    }

    try {
      const response = await axios.delete("http://localhost:5000/delete-expense", {
        data: { email: email, ids: idsArray }, // Send email + IDs in request body
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
      });

      alert(response.data.message);
      setDeleteIds(""); // Reset input
      fetchUserData();
      fetchExpenses(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting expense:", error.response?.data || error.message);
      alert("Failed to delete expenses. Try again!");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      fetchExpenses();
      const res = await axios.get(`http://localhost:5000/get-pdf?email=${email}`);
      console.log("Fetched data for PDF:", res.data);

      if (expenses.length === 0) {
        alert("No data available to generate PDF.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Expense Report", 14, 15);

      // Table Headers
      const headers = [["ID", "Category", "Description", "Amount"]];

      // Table Data
      const data = expenses.map((item, index) => [
        index + 1,
        item.category || "Unknown",
        item.description || "No description",
        `${item.amount}`,
      ]);

      // Create Table
      doc.autoTable({
        startY: 20,
        head: headers,
        body: data,
        theme: "grid",
        styles: { halign: "center" },
        headStyles: { fillColor: [0, 153, 255] },
      });

      // Save PDF
      doc.save("expenses.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF.");
    }
  };

  return (
    <div className="dashboard-content">
      {userData ? (
        <>
          <div className="dashboard-nav-container">
            <nav className="dashboard-navbar">
              <div className="dashboard-logo">
                <img src={navLogo} alt="Logo" className="logo" />
              </div>
              <div className="dashboard-buttons">
                <button className="dashboard-button"><a href="#sectionHome">Home</a></button>
                <button className="dashboard-button"><a href="#sectionExpense">Expenses</a></button>
                <button className="dashboard-button"><a href="#sectionData">Your Data</a></button>
              </div>
            </nav>
          </div>
          {error && <p className="error-message">{error}</p>}
          <section id="sectionHome">
            <div className="home-content">
              <div className="home-container">
                <div className="home-card">
                  <div className="home-card-description">
                    <h1 className="home-title">Hi, <span className="highlights">{userData.username}</span></h1>
                    <h2 className="home-title">Welcome to <span className="highlights">Expense Tracker</span> Dashboard</h2>
                    <h3 className="home-title">Track your Expenses Easily</h3>
                    <p className="home-description">Manage your daily expenses efficiently and take control of your
                      financial health.</p>
                    <ul className="home-description">
                      <li>➕ Add your daily expenses</li>
                      <li>📈 View spending insights</li>
                      <li>💰 Set monthly budgets</li>
                      <li>🔔 Get expense alerts</li>
                    </ul>
                  </div>
                  <div className="home-card-image">
                    <img src={homeLogo} alt="Logo" className="home-image" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="sectionExpense">
            <div className="expense-content">
              <div className="expense-cards">
                <div className="expense-card">
                  <p className="expense-card-title">Add Expense</p>
                  <div className="expense-card-from">
                    <form onSubmit={handleAddExpense}>
                      <label htmlFor="amount">Enter the cost(amount): </label><br></br>
                      <input type="number" name="amount" placeholder="Enter amount" required value={formData.amount} onChange={handleChange} />
                      <label htmlFor="select">Category(income / expense): </label><br></br>
                      <select name="category" required value={formData.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select><br></br>
                      <label htmlFor="description">Enter the description(detail of data): </label><br></br>
                      <input type="text" name="description" placeholder="Enter details" value={formData.description} onChange={handleChange} />
                      <p><strong className="highlights">Note:</strong> Once you add the data you can't change it, So fill the details carefully</p>
                      <div className="button-container button-add">
                        <button type="submit">Add Expense</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="expense-card">
                  <p className="expense-card-title">Delete Expense</p>
                  <div className="expense-card-from">
                    <form onSubmit={handleDeleteExpense}>
                      <label htmlFor="id">Enter Expense ID(s):</label><br />
                      <input
                        type="text"
                        name="id"
                        placeholder="Enter Expense ID(s) e.g., 1,2,3"
                        required
                        value={deleteIds}
                        onChange={(e) => setDeleteIds(e.target.value)}
                      />
                      <p>You can see your data in the table below and enter IDs for the records you want to delete.</p>
                      <p><strong className="highlights">Note:</strong> Once you delete the data, it cannot be recovered.</p>
                      <div className="button-container button-delete">
                        <button type="submit">Delete Expenses</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="sectionData">
            <div className="data-content">
              <div className="data-container">
                <div className="data-cards">
                  <div className="data-top-cards">
                    <div className="data-top-card">
                      <h3>Total Income: ₹<b className="highlights">{userData.totalIncome}</b></h3>
                    </div>
                    <div className="data-top-card">
                      <h3>Total Expense: ₹<b className="highlights" >{userData.totalExpense}</b></h3>
                    </div>
                    <div className="data-top-card">
                      <button onClick={handleDownloadPDF} disabled={loading} >Download PDF 📄</button>
                    </div>
                  </div>
                  <div className="data-bottom-card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.expenses.map((exp) => (
                          <tr key={exp.id}>
                            <td>{exp.user_expense_id}</td>
                            <td>{exp.category}</td>
                            <td>{exp.description}</td>
                            <td>₹ {exp.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="footer">
            <p>&copy; 2025 Expense Tracker </p> <img src={logo} alt="footor-logo"/>
          </div>
        </>
      ) : <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;