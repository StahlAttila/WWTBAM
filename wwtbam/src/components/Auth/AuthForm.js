import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router";
import { CircularProgress, Alert } from "@mui/material";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    const eneteredEmail = emailInputRef.current.value;
    const eneteredPassword = passwordInputRef.current.value;

    try {
      if (isLogin) {
        await authCtx.login(eneteredEmail, eneteredPassword);
        history.push("/");
      } else {
        await authCtx.signUp(username, eneteredEmail, eneteredPassword);
        setMessage("Account created! Check your mailbox to confirm registration.")
      }
      setIsLoading(false)
    } catch (err){
      if(err.message.includes("not-found")) {
        setError("Email or password doesnt match.")
      } else {
        setError("Failed to sign in/sign up!")
      }
      setIsLoading(false)
    } 
  };

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  return (
    <section className={classes.auth}>

      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="username">Your Username</label>
            <input
              value={username}
              type="text"
              id="username"
              required
              onChange={usernameChangeHandler}
            />
          </div>
        )}
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          {isLoading && <CircularProgress/>}
          {!isLoading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
