import React, { useContext, useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/use-http";
import { signIn, signUp } from "../../lib/api";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const { sendRequest: signInRequest, status: signInStatus, data: signInData, error: signInError } = useHttp(signIn, false);
  const { sendRequest: signUpRequest, status: signUpStatus, data: signUpData, error: signUpError } = useHttp(signUp, true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const eneteredEmail = emailInputRef.current.value;
    const eneteredPassword = passwordInputRef.current.value;


    if(isLogin) {
      signInRequest({email: eneteredEmail, password: eneteredPassword});
    } else {
      signUpRequest({username: username, email: eneteredEmail, password: eneteredPassword});
    }
  };

  useEffect(() => {
    if(signInStatus === 'completed' && !signInError && signInData) {
      authCtx.login(signInData);
    }
  }, [authCtx, signInStatus, signInData, signInError]);


  if(signInError || signUpError) {
    const message = signInError || signUpError;
    return <div><h1>{message}</h1></div>
  }

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value)
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="username">Your Username</label>
            <input value={username} type="text" id="username" required onChange={usernameChangeHandler} />
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
          <button>{isLogin ? "Login" : "Create Account"}</button>

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
