import React from "react";
import { Link } from "react-router-dom";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>WWTBAM</div>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/profile">Stati</Link>
          </li>
          <li>
            <button>Login</button>
          </li>
          <li>
            <button>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
