import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { logger } from "../common-util";

export const Home = ({ currentUser }: any) => {
  useEffect(() => {
    logger("current user is ", currentUser);
  }, [currentUser]);

  // main render
  return (
    <React.Fragment>
      <div>home is here </div>
    </React.Fragment>
  );
};

Home.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
