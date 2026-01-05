import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "assets/css/login.css";
import { loginData , employeeData } from "mockdata";
import { UserAuth } from "../../contextAuth/AuthenticationContext";

export default function Login({ onLogin }) {
    const {login} = UserAuth();

    localStorage.setItem(
        "EmployeeData",
        JSON.stringify(employeeData)
    );
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const users = loginData.users;

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login to continue</h2>
                {/* <p className="login-subtitle"></p> */}

                <form id="loginFormId">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button
                        type="button"
                        className="login-btn"
                        onClick={() => {
                            const fetchUser = users.find(
                                dt => dt.username === username && dt.password === password
                            );

                            if (fetchUser) {
                                login(username)
                                navigate("/Employee/EmployeeListing");
                            } else {
                                setError("Invalid username or password");
                            }
                        }}
                    >
                        Login
                    </button>
                </form>

                <div className="login-footer">
                    <p>Mock Credentials:</p>
                    <span>admin / admin123</span>
                </div>
            </div>
        </div>
    );
}
