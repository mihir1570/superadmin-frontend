import React, { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import { message, Popconfirm } from 'antd';
import image from "../img/PVOT_Designs.png"
import BASE_URL from './config';



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigator = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("superadminlogin");
        if (auth) {
            navigator("/dashboard");
        }
    }, []);

    const checkLogin = () => {
        if (!email.trim() || !password.trim()) {
            message.info("Please enter your email and password.");
            setError(true);
            return;
        } else {
            if (email === "mihir@gmail.com" && password === "123") {
                message.success('Login Successful')
                const data = {
                    email: email,
                    password: password
                };
                localStorage.setItem("superadminlogin", JSON.stringify(data));
                navigator("/dashboard");
            } else {
                setError(true);
                message.error("Invalid email or password. Please try again.");
            }
        }
    };


    return (
        <>
            <div className="container">
                <div className="login-container">
                    <div className="login-logo">
                        <img src={image} alt="Company Logo" width="150" />
                    </div>
                    <h4 className="login-title">Login</h4>
                    <h2 className="login-subtitle">Super Admin</h2>
                    
                    <form id="loginForm">

                        <div className="input-container">
                            <input
                                type="email"
                                id="adminemail"
                                name="email"
                                aria-labelledby="label-fname"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="label" htmlFor="adminemail" id="label-email">
                                <div className="text">Email</div>
                            </label>
                        </div>

                        <div className="showErrors">
                            {error && !email.trim() && <span style={{ color: "red" }}>Please enter a valid email</span>}
                        </div>

                        <div className="input-container">
                            <input
                                type="password"
                                id="adminpassword"
                                name="password"
                                aria-labelledby="label-fname"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label" htmlFor="adminpassword" id="label-password">
                                <div className="text">Password</div>
                            </label>
                        </div>

                        <div className="showErrors">
                            {error && !password.trim() && <span style={{ color: "red" }}>Please enter a valid password</span>}
                        </div>

                        <button type="button" className="btn btn-primary btn-block" onClick={checkLogin}>Login</button>

                        {/* <div className="text-center mt-3">
                            <a href="#">Forgot password?</a>
                        </div> */}

                    </form>

                </div>
            </div>
        </>
    )
}

export default Login;