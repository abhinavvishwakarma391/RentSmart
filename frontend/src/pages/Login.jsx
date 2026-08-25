import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter your User ID and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid User ID or Password."
        );
      }

      /*
       * SAVE LOGIN STATE
       */

      localStorage.setItem(
        "rentsmart_logged_in",
        "true"
      );

      localStorage.setItem(
        "rentsmart_user_id",
        data.user_id
      );

      /*
       * Tell Navbar that login happened
       */

      window.dispatchEvent(
        new Event("rentsmart-login")
      );

      /*
       * Go to Home
       */

      navigate("/");
    } catch (err) {
      setError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-card">

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-logo">
            🏠
          </div>

          <h1>
            Rent<span>Smart</span>
          </h1>

        </div>


        {/* HEADING */}

        <div className="login-heading">

          <h2>
            Welcome back!
          </h2>

          <p>
            Login to continue to RentSmart
          </p>

        </div>


        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* USER ID */}

          <div className="login-field">

            <label htmlFor="userId">
              User ID
            </label>

            <input
              id="userId"
              type="text"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) =>
                setUserId(e.target.value)
              }
              autoComplete="username"
            />

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login →"}

          </button>

        </form>


        {/* REGISTER */}

        <div className="login-register">

          <span>
            Don't have an account?
          </span>

          <Link
            to="/register"
            className="create-account"
          >
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;