import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Button, Slide, Toolbar, useScrollTrigger, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useContext } from 'react';
import { logger } from '../../common-util';
import { actions, AppCtx } from '../../context';
import { logout } from '../../services';

const HideOnScrollAppbar = (props: any) => {
    const { children, window } = props;

    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    // main render
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const NavBar = (props: any) => {
    const theme = useTheme();
    const { state, dispatch } = useContext(AppCtx);
    const { palette } = theme;
    const { children, history } = props;

    //#region api calls
    const logOut = useCallback(async () => {
        try {
            const res = await logout();

            dispatch({ type: actions.LOG_OUT });

            history.replace('/logout');

            return res;
        } catch (err) {
            logger('error thrown in logOut', err);
            throw err;
        }
    }, [history, dispatch]);
    //#endregion

    //#region handlers
    const handleLoginRedirect = useCallback(() => {
        window.location.href = `${process.env.REACT_APP_API_PREFIX}/auth`;
    }, []);

    const handlePushToHome = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/home');
        },
        [history],
    );

    const handlePushToDash = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            history.push('/dashboard');
        },
        [history],
    );

    const handleLogout = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            logger('logout pressed');
            logOut();
        },
        [logOut],
    );
    //#endregion

    //#region renders
    const renderAvatar = useCallback(() => {
        if (!state.user) return <FontAwesomeIcon icon={faUserAstronaut} size="2x" color="white" />;

        let avatar;
        if (state.user && state.user?.images?.length > 0) {
            avatar = state.user.images[0].url;
        }

        return <img src={avatar} className="avatar" alt="User avatar" />;
    }, [state.user]);

    const renderUserInfo = useCallback(() => {
        if (!state.user) return null;

        return (
            <div id="header-userinfo-container">
                <div className="avatar-container">{renderAvatar()}</div>
                <div id="header-username">{state.user.display_name}</div>
            </div>
        );
    }, [state.user, renderAvatar]);

    const renderLogin = useCallback(() => {
        if (!state.user)
            return (
                <Button
                    className="flex"
                    style={{ marginRight: '1.5rem', backgroundColor: SPOTIFY_GREEN }}
                    variant="contained"
                    onClick={handleLoginRedirect}
                    title="Connect with Spotify"
                >
                    <FontAwesomeIcon icon={faSpotify} color={palette.text.primary} size="2x" />
                    <span style={{ paddingLeft: '12px' }}>Connect with Spotify</span>
                </Button>
            );

        return (
            <Button
                variant="contained"
                style={{ backgroundColor: palette.success.main, color: 'white' }}
                onClick={handleLogout}
            >
                Logout
            </Button>
        );
    }, [state.user, handleLogout, palette, handleLoginRedirect]);

    const renderButtons = useCallback(() => {
        if (!state.isAuthenticated) {
            return <div>{renderLogin()}</div>;
        }

        return (
            <div className="flex" style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                <Button
                    style={{ marginRight: '1rem' }}
                    className="flex"
                    variant="contained"
                    color="secondary"
                    onClick={handlePushToHome}
                >
                    Home
                </Button>
                <Button
                    style={{ marginRight: '1rem' }}
                    className="flex"
                    variant="contained"
                    color="secondary"
                    onClick={handlePushToDash}
                >
                    Dashboard
                </Button>
                {renderLogin()}
            </div>
        );
    }, [state.isAuthenticated, renderLogin, handlePushToDash, handlePushToHome]);
    //#endregion

    // main render
    return (
        <React.Fragment>
            <HideOnScrollAppbar {...props}>
                <AppBar position="fixed" className="flex" style={{ padding: '0.5rem', margin: 0 }}>
                    <Toolbar className="flex flex-1 flex-align-center">
                        {renderUserInfo()}
                        <h3 className="header-title" style={{ textShadow: '1px 1px 10px 4px rgba(0, 0, 0, 0.3)' }}>
                            festival.me
                        </h3>
                        {renderButtons()}
                    </Toolbar>
                </AppBar>
            </HideOnScrollAppbar>
            <Toolbar />
            <div className="flex flex-col" style={{ paddingTop: '4rem' }}>
                {children}
            </div>
        </React.Fragment>
    );
};

NavBar.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
    history: PropTypes.shape({
        push: PropTypes.func,
        replace: PropTypes.func,
    }).isRequired,
};

export default NavBar;

const SPOTIFY_GREEN = '#1DB954';
