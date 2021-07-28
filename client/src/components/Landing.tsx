import React, { useContext, useEffect } from "react";
import { logger } from "../common-util";
import { AppCtx } from "../context";

const Landing = (_props: any) => {
  const { state } = useContext(AppCtx);

  useEffect(() => {
    logger("state.isAuthenticated in Landing.tsx", state.isAuthenticated);
  }, [state.isAuthenticated]);

  // main render
  return (
    <React.Fragment>
      <div>You must login to Spotify to use this app.</div>
    </React.Fragment>
  );
};

export default Landing;
