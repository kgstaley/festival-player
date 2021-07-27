"use-strict";
import { Container, createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { useCallback, useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { logger } from "./common-util";
import { Dashboard, Home, NavBar } from "./components/index";
import { AppCtx, actions } from "./context";
import { getMe } from "./services";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6A7B76",
    },
    secondary: {
      main: "#8B9D83",
    },
    info: {
      main: "#BEB0A7",
    },
    success: {
      main: "#3A4E48",
    },
    text: {
      primary: "#040303",
      secondary: "#3A4E48",
      disabled: "#BEB0A7",
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { state, dispatch } = useContext(AppCtx);

  logger("app context state is in App.tsx", state);

  const fetchMe = useCallback(async () => {
    try {
      const res = await getMe();
      logger("res in fetchMe", res);

      dispatch({ type: actions.SET_USER, user: res });
      dispatch({ type: actions.SET_AUTHENTICATED, isAuthenticated: true });
      setIsAuthenticated(true);
    } catch (err) {
      logger("error", err);
      throw err;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!state.user) {
      fetchMe();
    }
  }, [state.user, fetchMe]);

  const renderSwitch = useCallback(() => {
    return (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        {isAuthenticated && (
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        )}
      </Switch>
    );
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Helmet>
          <title>Festify</title>
        </Helmet>
        <Router>
          <NavBar>
            <Container>{renderSwitch()}</Container>
          </NavBar>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
