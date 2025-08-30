"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/styles/UserAuthentication.css";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function UserAuthentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", password2: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // 🔑 loading state
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // start loading
        try {
            if (isLogin) {
                const res = await axios.post("http://127.0.0.1:8000/api/users/login/", {
                    username: formData.username,
                    password: formData.password
                });
                login(res.data.access);
                localStorage.setItem("refreshToken", res.data.refresh);
                toast.success(`Welcome back, ${formData.username}!`);
                router.push("/homepage");
            } else {
                await axios.post("http://127.0.0.1:8000/api/users/register/", formData);
                toast.success("Account created successfully!");
                setIsLogin(true);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || "An error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className={`user-authentication-component ${isLogin ? '' : 'active'}`}>
            <div className="form-box login">
                <h2 className="title">Login</h2>
                {/* Login form goes here */}
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                    </div>
                    <div className="input-container">
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                    </div>
                    <button className="user-authentication-button" type="submit" disabled={loading}>
                        {loading ?  (
                            <>
                                {"Authenticating"}
                                <div className="spinner"></div>
                            </>
                        ) : "Login"}
                    </button>
                    <p className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
                        Don&apos;t have an account? <span>Sign Up</span>
                    </p>
                </form>
            </div>

            <div className="form-box register">
                <h2 className="title">Register</h2>
                {/* Sign-up form goes here */}
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                    </div>
                    <div className="input-container">
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" /> {/* You can use a different icon here if you prefer */}
                    </div>
                    <div className="input-container">
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                    </div>
                    <div className="input-container">
                        <input type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} required />
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                    </div>
                    <button className="user-authentication-button" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                {"Creating Profile"}
                                <div className="spinner"></div>
                            </>
                            ) : "Register"}
                    </button>
                    <p className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
                        Already have an account? <span>Login</span>
                    </p>
                </form>
            </div>

            {/* Add the "welcome" text panel, which also slides */}
            <div className="welcome-panel">
                <div className="welcome-panel-login">
                    <h2>WELCOME BACK!</h2>
                    <p>We are happy to have you with us again. If you need anything, we are here to help.</p>
                </div>
                <div className="welcome-panel-register">
                    <h2>WELCOME!</h2>
                    <p>We&apos;re delighted to have you here. If you need any assistance, feel free to reach out.</p>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div className="user-authentication-component">
    //         <h2>{isLogin ? "Login" : "Sign Up"}</h2>
    //         {/* {error && <p className="error">{error}</p>} */}
    //         <form onSubmit={handleSubmit}>
    //             <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
    //             {!isLogin && <input type="email" name="email" placeholder="Email" onChange={handleChange} required />}
    //             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
    //             {!isLogin && <input type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} required />}

    //             <button className="user-authentication-button" type="submit" disabled={loading}>
    //                 {loading ? (
    //                     <>
    //                         {isLogin ? "Authenticating" : "Creating Profile"}
    //                         <div className="spinner"></div>
    //                     </>
    //                 ) : (
    //                     isLogin ? "Login" : "Register"
    //                 )}
    //             </button>
    //         </form>

    //         <button
    //             className="dont-have-account-button"
    //             onClick={() => setIsLogin(!isLogin)}
    //             disabled={loading}
    //         >
    //             {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
    //         </button>
    //     </div>
    // );
}