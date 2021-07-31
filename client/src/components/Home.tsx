import { Container } from "@material-ui/core";
import React, { BaseSyntheticEvent, useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { logger } from "../common-util";
import { TopArtistsAndTracks } from "./common-ui";

const Home = (_props: any) => {
  const [topType, setTopType] = useState("artists");

  const handleChangeType = useCallback((e: BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logger("handle change type", e.target.value);
    setTopType(e.target.value);
  }, []);

  //#region renders
  const renderSideMenu = useCallback(() => {
    return (
      <React.Fragment>
        <div>
          <option value="artists" onClick={handleChangeType}>
            Top Artists
          </option>
          <option value="tracks" onClick={handleChangeType}>
            Top Tracks
          </option>
        </div>
      </React.Fragment>
    );
  }, [handleChangeType]);
  //#endregion

  // main render
  return (
    <React.Fragment>
      <Helmet>
        <title>festival.me - Home</title>
      </Helmet>
      <Container>
        <div className="flex flex-1 flex-row">
          {renderSideMenu()}
          <TopArtistsAndTracks type={topType} />
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Home;
