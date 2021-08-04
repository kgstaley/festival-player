'use-strict';
import { Container, LinearProgress } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { lazy, Suspense, useCallback, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { logger } from './common-util';
import { FadeIn } from './components/common-ui';
import { NavBar } from './components/index';
import { actions, AppCtx } from './context';
import { routes } from './routes';
import { getMe } from './services';
import './styles/styles.scss';
import { theme } from './styles/theme';

const Drawer = lazy(() => import('./components/Drawer'));

const App = (props: any) => {
    const { state, dispatch } = useContext(AppCtx);
    const { location } = props;

    const fetchMe = useCallback(async () => {
        try {
            dispatch({ type: actions.SET_LOADING_USER, loading: true });
            const res = await getMe();
            logger('res in fetchMe', res);

            if (!res.id) {
                dispatch({ type: actions.SET_USER, user: null });
                dispatch({ type: actions.SET_AUTHENTICATED, isAuthenticated: false });
                return;
            }

            dispatch({ type: actions.SET_USER, user: res });
            dispatch({ type: actions.SET_AUTHENTICATED, isAuthenticated: true });
        } catch (err) {
            logger('error', err);
            throw err;
        } finally {
            dispatch({ type: actions.SET_LOADING_USER, loading: false });
        }
    }, [dispatch]);

    useEffect(() => {
        if (
            !state.user &&
            !state.loading &&
            !location.pathname.includes('/logout') &&
            !location.pathname.includes('/welcome')
        ) {
            logger('fetching user ');
            fetchMe();
        }
    }, [state.user, fetchMe, location.pathname, state.loading]);

    const mapRenderRoutes = useCallback(() => {
        const filteredRoutes = !state.isAuthenticated
            ? routes.filter((r) => !r.requiresAuth)
            : routes.filter((r) => r.requiresAuth);

        const redirect = !state.isAuthenticated ? '/welcome' : '/dashboard';

        const routeComps = filteredRoutes.map((route) => {
            const Comp = route.component;
            return (
                <Route exact={route.exact} path={route.paths} key={route.id}>
                    {(routerProps) => (
                        <TransitionGroup id="app-transition-group" key="app-transition-group">
                            <FadeIn in key={route.id}>
                                <React.Fragment>
                                    <Comp {...routerProps} />
                                </React.Fragment>
                            </FadeIn>
                        </TransitionGroup>
                    )}
                </Route>
            );
        });

        const mappedRoutes = routeComps.concat([<Redirect key="redirect" to={redirect} />]);

        return mappedRoutes;
    }, [state.isAuthenticated]);

    const renderFooter = useCallback(() => {
        return (
            <React.Fragment>
                <div
                    id="footer"
                    className="flex flex-1 flex-col flex-justify-center"
                    style={{ color: theme.palette.info.dark }}
                >
                    Copyright © 2021 Kerry Staley. All rights reserved.
                </div>
            </React.Fragment>
        );
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Helmet>
                    <title>festival.me</title>
                </Helmet>
                <Suspense fallback={<LinearProgress variant="buffer" color="primary" value={20} valueBuffer={50} />}>
                    <NavBar {...props}>
                        <Drawer />
                        <Container>
                            <Switch>{mapRenderRoutes()}</Switch>
                        </Container>
                        {renderFooter()}
                    </NavBar>
                </Suspense>
            </div>
        </ThemeProvider>
    );
};

App.propTypes = {
    props: PropTypes.shape({}),
};

export default withRouter(App);
