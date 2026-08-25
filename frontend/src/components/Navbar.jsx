import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";


function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();


  /* =========================================
     LOGIN STATE
     ========================================= */

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem(
      "rentsmart_logged_in"
    ) === "true"
  );

  const [userId, setUserId] = useState(
    localStorage.getItem(
      "rentsmart_user_id"
    ) || ""
  );


  /* =========================================
     UPDATE LOGIN STATE
     ========================================= */

  useEffect(() => {

    const updateLoginState = () => {

      const status =
        localStorage.getItem(
          "rentsmart_logged_in"
        ) === "true";

      const id =
        localStorage.getItem(
          "rentsmart_user_id"
        ) || "";

      setLoggedIn(status);
      setUserId(id);
    };


    window.addEventListener(
      "rentsmart-login",
      updateLoginState
    );

    window.addEventListener(
      "rentsmart-logout",
      updateLoginState
    );


    return () => {

      window.removeEventListener(
        "rentsmart-login",
        updateLoginState
      );

      window.removeEventListener(
        "rentsmart-logout",
        updateLoginState
      );

    };

  }, []);


  /* =========================================
     LOGOUT
     ========================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "rentsmart_logged_in"
    );

    localStorage.removeItem(
      "rentsmart_user_id"
    );

    setLoggedIn(false);
    setUserId("");


    window.dispatchEvent(
      new Event("rentsmart-logout")
    );


    navigate("/");
  };


  /* =========================================
     ACTIVE LINK
     ========================================= */

  const isActive = (path) => {

    return location.pathname === path
      ? "active"
      : "";

  };


  return (

    <header className="navbar">

      {/* =====================================
          LOGO
          ===================================== */}

      <Link
        to="/"
        className="navbar-logo"
      >

        <div className="navbar-logo-icon">
          🏠
        </div>

        <span>
          Rent<span>Smart</span>
        </span>

      </Link>


      {/* =====================================
          NAVIGATION
          ===================================== */}

      <nav className="navbar-links">

        <Link
          to="/"
          className={isActive("/")}
        >
          Home
        </Link>


        <Link
          to="/recommendations"
          className={isActive(
            "/recommendations"
          )}
        >
          Recommendations
        </Link>


        <Link
          to="/market"
          className={isActive(
            "/market"
          )}
        >
          Market
        </Link>


        <Link
          to="/about"
          className={isActive(
            "/about"
          )}
        >
          About
        </Link>


        {/* =================================
            NOT LOGGED IN
            ================================= */}

        {!loggedIn && (

          <Link
            to="/login"
            className="nav-button"
          >
            Get Started
          </Link>

        )}


        {/* =================================
            LOGGED IN
            ================================= */}

        {loggedIn && (

          <div className="navbar-account">

            <div
              className="account-button"
              title={`Logged in as ${userId}`}
            >
              👤
            </div>


            <span className="navbar-user">
              {userId}
            </span>


            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        )}

      </nav>

    </header>

  );
}

export default Navbar;