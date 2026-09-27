import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      login(response.data);

      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid username or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Branding Section */}
      <section className="login-brand-panel">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="brand-logo-icon">
              <ShieldCheck size={28} strokeWidth={2.2} />
            </div>

            <div>
              <h1>WorkSphere</h1>
              <span>HR Management System</span>
            </div>
          </div>

          <div className="brand-main">
            <span className="brand-badge">SMART HR MANAGEMENT</span>

            <h2>
              Manage your workforce
              <span> with confidence.</span>
            </h2>

            <p>
              A secure and centralized platform for managing employees,
              attendance, leave requests and payroll.
            </p>
          </div>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-check">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>Secure Access</strong>
                <span>Role-based authentication</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-check">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>Centralized Management</strong>
                <span>Employees, leaves and payroll</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-check">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>Real-time Visibility</strong>
                <span>Access important HR information quickly</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          © {new Date().getFullYear()} WorkSphere. All rights reserved.
        </div>
      </section>

      {/* Login Section */}
      <main className="login-content">
        <div className="login-card">
          <div className="mobile-brand">
            <div className="brand-logo-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1>WorkSphere</h1>
              <span>HR Management System</span>
            </div>
          </div>

          <div className="login-heading">
            <span className="login-welcome">WELCOME BACK</span>

            <h2>Sign in to your account</h2>

            <p>
              Enter your credentials to access your HR dashboard.
            </p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>

              <div className="input-wrapper">
                <User size={19} className="input-icon" />

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
              </div>

              <div className="input-wrapper">
                <LockKeyhole size={19} className="input-icon" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="login-security">
            <LockKeyhole size={15} />
            <span>Your connection is secured with JWT authentication</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;