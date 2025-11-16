import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setSubmitMessage("");

      // Simulate successful login
      setSubmitMessage("Login successful! Redirecting...");
      reset();

      await axios
        .post("http://localhost:3000/api/auth/login", data, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSubmitMessage("");
        });
    } catch (error) {
      console.error("Login error:", error);
      setSubmitMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {submitMessage && (
          <div className="success-message">{submitMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className={`form-group ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? "btn-loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to Register */}
        <div className="auth-link-section">
          <p>
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
