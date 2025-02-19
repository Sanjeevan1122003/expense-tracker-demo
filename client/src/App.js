import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import "./App.css";
import { useState } from "react";
import expenseLogo from "./assets/expense_tracker_logo.png"

function App() {
  const [email, setEmail] = useState(null);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img
                  src={expenseLogo}
                  className="App-logo"
                  alt="logo"
                />
                <p className="App-heading">Welcome to Expense Tracker</p>
                <a
                  className="getstarted"
                  href="/register"
                  rel="noopener noreferrer"
                >
                  Get started
                </a>
              </header>
            </div>
          }
        />
        <Route path="/login" element={<Login setEmail={setEmail} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard email={email} />} />
      </Routes>
    </Router>
  );
}

export default App;
