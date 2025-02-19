import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pagesstyle.css";
import userFromBg from "../assets/user-from-background.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setEmail }) => {
    const [emailInput, setEmailInput] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/login", { email: emailInput, password });
            setEmail(emailInput);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="card-content">
            <div className="card-container" style={{ "--user-bg": `url(${userFromBg})` }}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)} 
                        required 
                    />
                    
                    {/* Password Input with Show/Hide Toggle */}
                    <div className="password-container">
                        <input 
                            type={showPassword ? "text" : "password"}  // Fix: Toggle input type
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

                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
};

export default Login;
