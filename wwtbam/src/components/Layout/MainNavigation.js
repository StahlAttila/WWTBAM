import React, { useContext, useHistory } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  let navBarContent;

  const logoutHandler = () => {
    authCtx.logout();
  }

  if (authCtx.isLoggedIn) {
    navBarContent = (
      <ul>
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li>
          <button onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    );
  } else {
    navBarContent = (
      <ul>
        <li>
          <NavLink to="/auth">Login</NavLink>
        </li>
      </ul>
    );
  }

  return (
    <header className={classes.header}>
      <NavLink to="/">
        <div className={classes.logo}>WWTBAM</div>
      </NavLink>
      <nav>
        {navBarContent}
      </nav>
    </header>
  );
};

export default MainNavigation;
