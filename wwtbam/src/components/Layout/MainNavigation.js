import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";
import AccountMenu from "./AccountMenu";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  let navBarContent;

  if (authCtx.isLoggedIn && authCtx.user) {
    navBarContent = (
      <ul>
        <li>
          <AccountMenu username={authCtx.user.displayName} logout={authCtx.logout}/>
        </li>
      </ul>
    );
  } else {
    navBarContent = (
      <ul>
        <li>
          <NavLink to="/auth" className="login">Login</NavLink>
        </li>
      </ul>
    );
  }

  return (
    <header className={classes.header}>
      <NavLink to="/">
        <div className={classes.logo}>WWTBAM</div>
      </NavLink>
      <nav>{navBarContent}</nav>
    </header>
  );
};

export default MainNavigation;
