import { Container } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { logger } from "../common-util";
import { AppCtx } from "../context";

export const Dashboard = () => {
  const { state } = useContext(AppCtx);

  useEffect(() => {
    logger("user from app context in Dashboard ", state.user);
  }, [state.user]);

  // main render
  return (
    <React.Fragment>
      <Helmet>
        <title>Festify - Dashboard</title>
      </Helmet>
      <Container>
        <div>Dashboard goes here</div>
      </Container>
    </React.Fragment>
  );
};
