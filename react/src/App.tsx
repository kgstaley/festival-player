import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import { useCallback } from "react";
import { Home } from "./components/index";
import { Button } from "@material-ui/core";
import { authService } from "./services/services";

// const DEFAULT_USER = {
//   id: 1,
//   name: "kerry",
// };

const log = console.log;

const App = () => {
  // const [user, setUser] = useState(DEFAULT_USER);

  const fetchUser = async () => {
    let res;
    try {
      res = await authService();
      log("res is ", res);

      if (!res) {
        throw new Error("no redirect callback returned");
      }
      // window.location = res;

      // const code = window.location.search.split("?code=").pop();
      // log("code is ", code);
      // const token = await getToken(code, "spotify_auth_state");
      // log("token", token);
    } catch (err) {
      log("error thrown in fetchUser", err);
      throw new Error(err);
    } finally {
      return res;
    }
  };

  const handleFetchUser = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    log("handle fetch user firing");
    fetchUser();
  }, []);

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
          <Button color="primary" onClick={handleFetchUser}>
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
