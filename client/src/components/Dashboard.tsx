import { Container, TextField, useTheme } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { logger } from "../common-util";
import { AppCtx } from "../context";

export const Dashboard = () => {
  const { state } = useContext(AppCtx);
  const theme = useTheme();

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
                color: "wheat",
                border: "1px wheat solid",
                borderRadius: "4px",
              },
            }}
          />
        </div>
      </React.Fragment>
    );
  }, [search, handleSearchChange]);

  // main render
  return (
    <React.Fragment>
      <Helmet>
        <title>festival.me - Dashboard</title>
      </Helmet>
      <Container>
        <div className="body-container">
          <div
            className="flex flex-1 flex-col"
            style={{
              backgroundColor: theme.palette.success.main,
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "2px 2px 10px 1px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3
              className="header-title"
              style={{ fontSize: "1.5rem", color: "wheat" }}
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
