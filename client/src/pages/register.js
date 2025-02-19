import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pagesstyle.css";
import userFromBg from "../assets/user-from-background.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Registration failed.");
      } else {
        setError(
          "Could not connect to the server. Please check your internet or server status."
        );
      }
    }
  };

  return (
    <div className="card-content">
      <div
        className="card-container"
        style={{ "--user-bg": `url(${userFromBg})` }}
      >
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
             <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;


