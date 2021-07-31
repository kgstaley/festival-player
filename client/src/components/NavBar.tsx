import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Button, useTheme } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useContext } from "react";
import { logger } from "../common-util";
import { AppCtx, actions } from "../context";
import { logout } from "../services";

const NavBar = ({ children, history }: { children: any; history: any }) => {
  const theme = useTheme();
  const { state, dispatch } = useContext(AppCtx);
  const { palette } = theme;

  //#region api calls
  const logOut = useCallback(async () => {
    try {
      const res = await logout();

      logger("logout response", res);

      dispatch({ type: actions.LOG_OUT });

      history.replace("/logout");

      return res;
    } catch (err) {
      logger("error thrown in logOut", err);
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
      history.push("/home");
    },
    [history]
  );

  const handlePushToDash = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      history.push("/dashboard");
    },
    [history]
  );

  const handleLogout = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      logger("logout pressed");
      logOut();
    },
    [logOut]
  );
  //#endregion

  //#region renders
  const renderAvatar = useCallback(() => {
    if (!state.user)
      return <FontAwesomeIcon icon={faUserAstronaut} size="2x" color="white" />;

    let avatar;
    if (state.user && state.user?.images?.length > 0) {
      avatar = state.user.images[0].url;
    }

    return <img src={avatar} className="avatar" alt="User avatar" />;
  }, [state.user]);

  const renderUserInfo = useCallback(() => {
    if (!state.user) return null;

    return (
      <React.Fragment>
        <div id="header-userinfo-container">
          <div className="avatar-container">{renderAvatar()}</div>
          <div id="header-username">{state.user.display_name}</div>
        </div>
      </React.Fragment>
    );
  }, [state.user, renderAvatar]);

  const renderLogin = useCallback(() => {
    if (!state.user)
      return (
        <Button
          style={{ marginRight: "1.5rem", backgroundColor: SPOTIFY_GREEN }}
          variant="contained"
          // color="secondary"
          onClick={handleLoginRedirect}
          title="Connect with Spotify"
        >
          <FontAwesomeIcon
            icon={faSpotify}
            color={palette.text.primary}
            size="2x"
          />
          <span style={{ paddingLeft: "12px" }}>Connect with Spotify</span>
        </Button>
      );

    return (
      <Button
        style={{ marginRight: "1.5rem" }}
        variant="contained"
        color="primary"
        onClick={handleLogout}
      >
        Logout
      </Button>
    );
  }, [state.user, handleLogout, palette.text.primary, handleLoginRedirect]);

  const renderButtons = useCallback(() => {
    if (!state.isAuthenticated) {
      return <div>{renderLogin()}</div>;
    }

    return (
      <div>
        <Button
          style={{ marginRight: "2rem" }}
          variant="contained"
          color="secondary"
          onClick={handlePushToHome}
        >
          Home
        </Button>
        <Button
          style={{ marginRight: "2rem" }}
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
      <AppBar position="static" style={{ padding: "0.5rem" }}>
        <div className="appbar-outer">
          <div className="appbar-inner">
            {renderUserInfo()}
            <div style={{ paddingLeft: "2rem" }}>
              <h3
                className="header-title"
                style={{ textShadow: "1px 1px 10px 4px rgba(0, 0, 0, 0.3)" }}
              >
                festival.me
              </h3>
            </div>
          </div>
          {renderButtons()}
        </div>
      </AppBar>
      <div>{children}</div>
    </React.Fragment>
  );
};

NavBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.func,
  ]),
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
};

export default NavBar;

const SPOTIFY_GREEN = "#1DB954";
