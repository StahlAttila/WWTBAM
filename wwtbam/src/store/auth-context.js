import React, { useCallback, useEffect, useState } from "react";

const AuthContext = React.createContext({
  token: "",
  userDetails: {},
  isLoggedIn: false,
  login: (loginData) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjustedTime = new Date(expirationTime).getTime();

  return adjustedTime - currentTime;
};

let logoutTimer;

const retrievedStoredUserInfo = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpTime = localStorage.getItem("expTime");
  const storedUsername = localStorage.getItem("username");

  const remainingTime = calculateRemainingTime(storedExpTime);

  if (remainingTime < 60000) {
    localStorage.removeItem("expTime");
    return null;
  }

  return {
    token: storedToken,
    username: storedUsername,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrievedStoredUserInfo();
  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const [userDetails, setUserDetails] = useState({});

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUserDetails(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expTime");
    localStorage.removeItem("user");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = useCallback((loginData) => {
    //loginData also contains refresh token for later usage
    setToken(loginData.tokenData.token);
    setUserDetails(loginData.userData);
    localStorage.setItem("token", loginData.tokenData.token);
    localStorage.setItem("user", JSON.stringify(loginData.userData));
    localStorage.setItem("expTime", loginData.tokenData.expirationTime);
    const remainingTime = calculateRemainingTime(loginData.tokenData.expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  },[logoutHandler]);

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    userDetails: userDetails,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;