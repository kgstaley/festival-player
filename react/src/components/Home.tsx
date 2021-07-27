import React, { useEffect } from "react";
import PropTypes from "prop-types";

const log = console.log;

export const Home = ({ currentUser }: any) => {
  useEffect(() => {
    log("current user is ", currentUser);
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
