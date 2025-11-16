import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const [submitMessage, setSubmitMessage] = useState("");
  const password = watch("password");
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setSubmitMessage("");

      // Simulate successful registration
      setSubmitMessage("Registration successful! Redirecting to login...");
      reset();

      await axios.post("http://localhost:3000/api/auth/register", {
        fullname:{
          firstname:data.firstName,
          lastname:data.lastName
        },
        email:data.email,
        password:data.password
      }, {
        withCredentials: true,
      }).then((res)=>{
        console.log(res);
        navigate("/")
      }).catch((err)=>{
        console.log(err)
      }).finally(()=>{
        setSubmitMessage("")
      })

      
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us today</p>
        </div>

        {submitMessage && (
          <div className="success-message">{submitMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Name and Last Name Row */}
          <div className="form-row">
            {/* First Name Field */}
            <div className={`form-group ${errors.firstName ? "error" : ""}`}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "First name can only contain letters",
                  },
                })}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <span className="form-error">{errors.firstName.message}</span>
              )}
            </div>

            {/* Last Name Field */}
            <div className={`form-group ${errors.lastName ? "error" : ""}`}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "Last name can only contain letters",
                  },
                })}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <span className="form-error">{errors.lastName.message}</span>
              )}
            </div>
          </div>

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
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])/,
                  message:
                    "Password must contain uppercase, lowercase character",
                },
              })}
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div
            className={`form-group ${errors.confirmPassword ? "error" : ""}`}
          >
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <span className="form-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? "btn-loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Link to Login */}
        <div className="auth-link-section">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
