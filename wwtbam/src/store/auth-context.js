import React, { useEffect, useState } from "react";
import { auth } from "../lib/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "@firebase/auth";

const AuthContext = React.createContext({
  user: {},
  isLoggedIn: false,
  signUp: function(username, email, password){return null},
  login: function(email, password){return null},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signUpHandler = async (username,email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then(res => {
      return updateProfile(res.user, {displayName: username})
    });
  }

  const loginHandler = (email, password) => {
    signInWithEmailAndPassword(auth, email, password);
    setIsLoggedIn(true);
  }

  const logoutHandler = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    signOut(auth);
  }

  const contextValue = {
    user: currentUser,
    isLoggedIn,
    signUp: signUpHandler,
    login: loginHandler,
    logout: logoutHandler,
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    return unsubscribe
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;