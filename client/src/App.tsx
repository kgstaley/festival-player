"use-strict";
import { Container, LinearProgress } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React, { useCallback, useContext, useEffect, Suspense } from "react";
import { Helmet } from "react-helmet";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import { logger } from "./common-util";
import { FadeIn } from "./components/common-ui";
import { NavBar } from "./components/index";
import { actions, AppCtx } from "./context";
import { routes } from "./routes";
import { getMe } from "./services";
import "./styles/styles.scss";
import { theme } from "./styles/theme";

const App = () => {
  const { state, dispatch } = useContext(AppCtx);

  logger("app context state is in App.tsx", state);

  const fetchMe = useCallback(async () => {
    try {
      const res = await getMe();
      logger("res in fetchMe", res);

      if (!res.id) {
        dispatch({ type: actions.SET_USER, user: null });
        dispatch({ type: actions.SET_AUTHENTICATED, isAuthenticated: false });
        return;
      }

      dispatch({ type: actions.SET_USER, user: res });
      dispatch({ type: actions.SET_AUTHENTICATED, isAuthenticated: true });
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

  const mapRenderRoutes = useCallback(() => {
    const filteredRoutes = !state.isAuthenticated
      ? routes.filter((r) => !r.requiresAuth)
      : routes.filter((r) => r.requiresAuth);

    const redirect = !state.isAuthenticated ? "/" : "/dashboard";

    const routeComps = filteredRoutes.map((route) => {
      const Comp = route.component;
      return (
        <Route exact={route.exact} path={route.paths} key={route.id}>
          {(routerProps) => (
            <TransitionGroup
              id="app-transition-group"
              key="app-transition-group"
            >
              <FadeIn in={true} key={route.id}>
                <React.Fragment>
                  <Comp {...routerProps} />
                </React.Fragment>
              </FadeIn>
            </TransitionGroup>
          )}
        </Route>
      );
    });

    const mappedRoutes = routeComps.concat([
      <Redirect key="redirect" to={redirect} />,
    ]);

    return mappedRoutes;
  }, [state.isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Helmet>
          <title>festival.me</title>
        </Helmet>
        <Suspense
          fallback={<LinearProgress variant="buffer" color="primary" />}
        >
          <Router>
            <NavBar>
              <Container>
                <Switch>{mapRenderRoutes()}</Switch>
              </Container>
            </NavBar>
          </Router>
        </Suspense>
      </div>
    </ThemeProvider>
  );
};

export default App;
