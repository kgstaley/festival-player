'use-strict';
import { Container, LinearProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { lazy, Suspense, useCallback, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { logger } from './common-util';
import { FadeIn } from './components/common-ui';
import { NavBar } from './components/layout';
import { actions, AppCtx } from './context';
import { routes } from './routes';
import { getMe } from './services';
import './styles/styles.scss';
import { theme } from './styles/theme';

const Drawer = lazy(() => import('./components/drawer/Drawer'));
const OptionsModal = lazy(() => import('./components/common-ui/OptionsModal'));

const App = () => {
    const { state, dispatch } = useContext(AppCtx);
    const location = useLocation();

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

        const routeComps = filteredRoutes.flatMap((route) => {
            const Comp = route.component;
            return route.paths.map((path, index) => (
                <Route
                    path={path}
                    key={`${route.id}-${index}`}
                    element={
                        <TransitionGroup id="app-transition-group" key="app-transition-group">
                            <FadeIn in key={route.id}>
                                <React.Fragment>
                                    <Comp />
                                </React.Fragment>
                            </FadeIn>
                        </TransitionGroup>
                    }
                />
            ));
        });

        const mappedRoutes = routeComps.concat([<Route key="redirect" path="*" element={<Navigate to={redirect} replace />} />]);

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
                    <NavBar>
                        <OptionsModal />
                        <Drawer />
                        <Container>
                            <Routes>{mapRenderRoutes()}</Routes>
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

export default App;
