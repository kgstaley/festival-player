import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useContext } from "react";
import { logger } from "../common-util";
import { AppCtx } from "../context";

export const NavBar = ({ children }: any) => {
  const { state } = useContext(AppCtx);

  const loginRedirect = () => {
    window.location.href = `${process.env.REACT_APP_API_PREFIX}/auth`;
  };

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
          style={{ marginRight: "1.5rem" }}
          variant="contained"
          color="secondary"
          onClick={loginRedirect}
        >
          Login to Spotify
        </Button>
      );

    return (
      <Button
        style={{ marginRight: "1.5rem" }}
        variant="contained"
        color="primary"
        onClick={() => logger("logout pressed")}
      >
        Logout
      </Button>
    );
  }, [state.user]);

  const renderButtons = useCallback(() => {
    return (
      <div>
        <Button
          style={{ marginRight: "2rem" }}
          variant="contained"
          color="secondary"
          href="/"
        >
          Home
        </Button>
        <Button
          style={{ marginRight: "2rem" }}
          variant="contained"
          color="secondary"
          href="/dashboard"
        >
          Dashboard
        </Button>
        {renderLogin()}
      </div>
    );
  }, [renderLogin]);

  // main render
  return (
    <React.Fragment>
      <AppBar position="static" style={{ padding: "0.5rem" }}>
        <div className="appbar-outer">
          <div className="appbar-inner">
            {renderUserInfo()}
            <div style={{ paddingLeft: "2rem" }}>
              <h3 className="header-title">festival.me</h3>
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
};
