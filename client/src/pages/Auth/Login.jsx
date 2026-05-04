import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* States */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  /* Demo Login Fill */
  const fillDemo = (type) => {
    const demoAccounts = {
      admin: {
        email: "admin@csd.edu",
        password: "password123",
      },
      staff: {
        email: "staff@csd.edu",
        password: "password123",
      },
      student: {
        email: "student@csd.edu",
        password: "password123",
      }
    };

    const account = demoAccounts[type];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  };

  return (
    <div className="login-page">

      {/* Background Shapes */}
      <div className="login-bg-shape s1"></div>
      <div className="login-bg-shape s2"></div>
      <div className="login-bg-shape s3"></div>

      {/* Left Branding */}
      <div className="login-branding">

        <div className="login-branding-logo">
          <h2>Campus Service Desk</h2>
        </div>

        <h1>
          Streamlined IT <br />
          <span>Facility Support</span>
        </h1>

        <p>
          Secure enterprise-grade campus management system built for
          students, staff, and administration workflows.
        </p>

        <div className="login-features">

          <div className="login-feature">
            <div className="login-feature-icon">✦</div>
            <span className="login-feature-text">
              Real-time Ticket Tracking
            </span>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">⬡</div>
            <span className="login-feature-text">
              Facility Maintenance Requests
            </span>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">◈</div>
            <span className="login-feature-text">
              Role based access system
            </span>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">▣</div>
            <span className="login-feature-text">
              Campus-wide Announcements
            </span>
          </div>

        </div>

      </div>

      {/* Right Login Form */}
      <div className="login-form-panel">

        <div className="login-form-card">

          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to CSD</p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-field-input">

                <span className="input-icon">
                  📧
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="student@csd.edu"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* Password Field */}
            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-field-input">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.73 1.84-3.27 3.23-4.5" />
                      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1 2.35-2.67 4.39-4.77 5.76" />
                      <path d="M1 1l22 22" />
                      <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* Remember Row */}
            <div className="login-remember-row">

              <label className="login-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                Remember me

              </label>

              <span className="login-forgot">
                Forgot password?
              </span>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

            {/* Back */}
            <button
              type="button"
              className="back-btn"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Home
            </button>

            {/* Divider */}
            <div className="login-divider">
              Demo Access
            </div>

            {/* Demo Credentials */}
            <div className="login-demo-info">

              <button
                type="button"
                onClick={() =>
                  fillDemo("admin")
                }
              >
                Admin Login
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemo("staff")
                }
              >
                Staff Login
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemo("student")
                }
              >
                Student Login
              </button>
              
              <Link to="/get-in-touch" style={{ width: '100%', display: 'block' }}>
                <button
                  type="button"
                  style={{ width: '100%' }}
                >
                  Get in Touch
                </button>
              </Link>

              <code>
                Password :
                password123
              </code>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;
