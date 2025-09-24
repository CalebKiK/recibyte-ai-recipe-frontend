"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/styles/shared/UserAuthentication.css";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faIdCard, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import { loginUser, registerUser } from "@/api/users";

export default function UserAuthentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required",)
    });

    const registerSchema = Yup.object({
        first_name: Yup.string()
            .min(3, "First name must be at least 3 characters")
            .required("First name is required"),
        last_name: Yup.string().optional(),
        gender: Yup.string().required("Gender is required"),
        username: Yup.string()
            .min(5, "Username must be at least 5 characters")
            .required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .matches(/[@$!%*?&#]/, "Must contain at least one special character")
            .required("Password is required"),
        password2: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (values, { resetForm }) => {
        // e.preventDefault();
        setLoading(true); 
        try {
            if (isLogin) {
                const res = await loginUser(values.email, values.password);
                await login({ access: res.access, refresh: res.refresh });
                toast.success(`Welcome back! ${res.first_name}`);
                router.push("/");
            } else {
                const res = await registerUser(values);
                await login({ access: res.access, refresh: res.refresh });
                toast.success("Account created successfully!");
                resetForm();
                setIsLogin(true);
            }
        } catch (err) {
            if (err && typeof err === "object") {
                if (Array.isArray(err.detail)) {
                    err.detail.forEach((msg) => toast.error(msg));
                } else if (err.detail) {
                    toast.error(err.detail);
                } else {
                    Object.keys(err).forEach((field) => {
                        const messages = err[field];
                        if (Array.isArray(messages)) {
                            messages.forEach((msg) => toast.error(`${msg}`));
                        } else {
                            toast.error(`${field}: ${messages}`);
                        }
                    });
                }
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false); 
        }
    };

    const genderOptions = [
        { value: '', label: 'Select Gender (Optional)' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non-binary', label: 'Non-Binary' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    ];

    return (
        <div className={`user-authentication-component ${isLogin ? '' : 'active'}`}>
            <div className='form-container'>
                <div className="form-box login">
                    <h2 className="title">Login</h2>
                    <Formik 
                        initialValues={{ email: "", password: "" }}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form>
                                <div className="input-container">
                                    <Field type="text" name="email" placeholder="Email" />
                                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="input-container">
                                    <Field type={showPassword ? "text" : "password"} name="password" placeholder="Password" />
                                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEye : faEyeSlash} 
                                        className="toggle-icon" 
                                        onClick={togglePasswordVisibility} 
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <button 
                                    className="user-authentication-button" 
                                    type="submit" 
                                    disabled={loading}
                                >
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
                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="form-box register">
                    <h2 className="title">Register</h2>
                    <Formik 
                        initialValues={{
                            first_name: "",
                            last_name: "",
                            gender: "",
                            username: "",
                            email: "",
                            password: "",
                            password2: "",
                        }}
                        validationSchema={registerSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form>
                                <div className="input-container">
                                    <Field type="text" name="first_name" placeholder="First name" />
                                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                                    <ErrorMessage
                                        name="first_name"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="input-container">
                                    <Field type="text" name="last_name" placeholder="Last name (Optional)" />
                                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                                    <ErrorMessage
                                        name="last_name"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="input-container">
                                    <Field as="select" name="gender" className="select-field">
                                        {genderOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="gender"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="input-container">
                                    <Field type="text" name="username" placeholder="Username" />
                                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="input-container">
                                    <Field type="email" name="email" placeholder="Email" />
                                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="error-message"
                                    /> 
                                </div>
                                <div className="input-container">
                                    <Field type={showPassword ? "text" : "password"} name="password" placeholder="Password" />
                                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEye : faEyeSlash} 
                                        className="toggle-icon" 
                                        onClick={togglePasswordVisibility} 
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="input-container">
                                    <Field type={showPassword ? "text" : "password"} name="password2" placeholder="Confirm Password" />
                                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEye : faEyeSlash} 
                                        className="toggle-icon" 
                                        onClick={togglePasswordVisibility} 
                                    />
                                    <ErrorMessage
                                        name="password2"
                                        component="div"
                                        className="error-message"
                                    />
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
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <div className="welcome-container">
                <div className="welcome-panel welcome-panel-login">
                    <h2>WELCOME BACK!</h2>
                    <p>We are happy to have you with us again. If you need anything, we are here to help.</p>
                </div>
                <div className="welcome-panel welcome-panel-register">
                    <h2>WELCOME!</h2>
                    <p>We&apos;re delighted to have you here. If you need any assistance, feel free to reach out.</p>
                </div>
            </div>
        </div>
    );
}