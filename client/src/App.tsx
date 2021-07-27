import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Home } from "./components/index";
import { Button } from "@material-ui/core";
import { getLoginUrl, login } from "./services";
import { logger } from "./common-util";

const App = () => {
  // const [user, setUser] = useState(DEFAULT_USER);
  const [loginUrl, setLoginUrl] = useState("");

  const fetchSpotifyUser = useCallback(async (code: string | any) => {
    try {
      const res = await login(code);
      logger("login res", res);

      return res;
    } catch (err) {
      logger("error ", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const url = getLoginUrl();
    setLoginUrl(url);
  }, []);

  useEffect(() => {
    if (window.location.search.includes("?code=")) {
      const code = window.location.search.split("?code=").pop();
      fetchSpotifyUser(code);
    }
  }, [fetchSpotifyUser]);

  const renderSwitch = useCallback(() => {
    return (
      <Switch>
        <Route>
          <Home />
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
          <Button color="primary" href={loginUrl}>
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
