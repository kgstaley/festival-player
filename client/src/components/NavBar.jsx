import { AppBar, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useContext } from "react";
import { logger } from "../common-util";
import { AppCtx } from "../context";

export const NavBar = ({ children }) => {
  const { state } = useContext(AppCtx);

  const loginRedirect = () => {
    window.location.href = `${process.env.REACT_APP_API_PREFIX}/auth`;
  };

  const renderUserInfo = useCallback(() => {
    if (!state.user) return null;

    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "5rem",
              width: "5rem",
              justifyContent: "center",
              borderRadius: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={state.user.images[0].url}
              style={{ display: "flex", flex: 1, height: null, width: null }}
              alt="User avatar"
            />
          </div>
          <div
            style={{
              color: "white",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            {state.user.display_name}
          </div>
        </div>
      </React.Fragment>
    );
  }, [state.user]);

  const renderLogin = useCallback(() => {
    if (!state.user)
      return (
        <Button variant="contained" color="secondary" onClick={loginRedirect}>
          Login to Spotify
        </Button>
      );

    return (
      <Button
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
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {renderUserInfo()}
            <div style={{ paddingLeft: "2rem" }}>
              <h3
                style={{
                  fontFamily: "monospace",
                  fontSize: "2.5rem",
                  fontWeight: 300,
                }}
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
};
