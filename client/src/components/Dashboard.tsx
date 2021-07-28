import { Container, TextField, useTheme } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { logger } from "../common-util";
import { AppCtx } from "../context";

const Dashboard = (_props: any) => {
  const { state } = useContext(AppCtx);
  const theme = useTheme();

  const { palette } = theme;

  const [search, setSearch] = useState("");

  useEffect(() => {
    logger("user from app context in Dashboard ", state.user);
  }, [state.user]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const renderSearchBox = useCallback(() => {
    return (
      <React.Fragment>
        <div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for an artist, track or album"
            onChange={handleSearchChange}
            value={search}
            type="text"
            inputProps={{
              style: {
                color: palette.info.main,
                border: "1px wheat solid",
                borderRadius: "4px",
              },
            }}
          />
        </div>
      </React.Fragment>
    );
  }, [search, handleSearchChange, palette]);

  // main render
  return (
    <React.Fragment>
      <Helmet>
        <title>festival.me - Dashboard</title>
      </Helmet>
      <Container>
        <div className="body-container">
          <div className="flex flex-1 flex-col dashboard-input-container">
            <h3
              className="header-title"
              style={{ fontSize: "1.5rem", color: palette.info.main }}
            >
              Auto-generate playlists based on a collection of your favorite
              artists or tracks
            </h3>
            {renderSearchBox()}
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
