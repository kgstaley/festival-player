import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Home, Dashboard } from "./components/index";
import { Button } from "@material-ui/core";
import { getMe } from "./services";
import { logger } from "./common-util";

const App = () => {
  const [user, setUser] = useState();

  const login = () => {
    window.location.href = `${process.env.REACT_APP_API_PREFIX}/auth`;
  };

  const fetchMe = useCallback(async () => {
    try {
      const res = await getMe();

      logger("res in fetchMe", res);

      setUser(res);
    } catch (err) {
      logger("error", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, []);

  const renderSwitch = useCallback(() => {
    return (
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/dashboard">
          <Dashboard user={user} />
        </Route>
      </Switch>
    );
  }, []);

  return (
    <div className="App">
      <Helmet>
        <title>sp_spotify_generator</title>
      </Helmet>
      <Router>
        <div>
          <Button color="primary" onClick={login}>
            Login to Spotify
          </Button>
          <p>test render</p>
        </div>

        {renderSwitch()}
      </Router>
    </div>
  );
};

export default App;
