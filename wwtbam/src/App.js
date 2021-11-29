import { Route, Switch } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/profile">
          <ProfilePage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
