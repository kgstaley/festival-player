import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { logger } from "../common-util";

export const Dashboard = ({ user }) => {
  useEffect(() => {
    logger("user from props is ", user);
  }, []);

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

Dashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
