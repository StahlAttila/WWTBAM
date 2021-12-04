import { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AuthContext from "./store/auth-context";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          {isLoggedIn && <HomePage />}
          {!isLoggedIn && <Redirect to="/auth/" />}
        </Route>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/profile">
          {isLoggedIn && <ProfilePage />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
