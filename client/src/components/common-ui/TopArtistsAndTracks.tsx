import { Container, Typography, useTheme } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { ArtistItem, FadeIn, TrackItem } from ".";
import { capitalize, logger, usePrevious } from "../../common-util";
import { AppCtx } from "../../context";
import { Artist, Track } from "../../interfaces";
import { getTopArtists } from "../../services/spotify";

export const TopArtistsAndTracks = ({ type }: { type: string }) => {
  const [init, setInit] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useContext(AppCtx);

  const theme = useTheme();
  const { palette } = theme;

  const prevType = usePrevious(type);

  //#region api call
  const fetchTop = useCallback(async () => {
    try {
      setLoading(true);
      logger("fetching top", type);

      const res = await getTopArtists(type);
      logger("res", res);

      const { items } = res;

      setData(items);

      return res;
    } catch (err) {
      logger("error thrown in fetchTop", err);
      throw err;
    } finally {
      setInit(false);
      setLoading(false);
    }
  }, [type]);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (type && init) {
      fetchTop();
    }
  }, [fetchTop, init, type]);

  useEffect(() => {
    if (type !== prevType && !init) {
      logger("diff in type");
      fetchTop();
    }
  }, [type, fetchTop, prevType, init]);
  //#endregion

  //#region renders
  const mapRenderTops = useCallback(() => {
    if (!data || !!!data.length) return null;

    return data.map((item: Artist | Track) => {
      const key = `tops-${item.name.replace(" ", "-")}-${item.id}`;
      logger("key for top renders", key);
      return (
        <FadeIn in key={key}>
          <div
            style={{
              margin: "1rem",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: palette.primary.dark,
              paddingLeft: "2rem",
              paddingRight: "2rem",
            }}
          >
            <div
              className="flex flex-1 flex-row flex-align-center"
              style={{ justifyContent: "space-between" }}
            >
              {item.type === "artists" ? (
                <ArtistItem {...item} />
              ) : (
                <TrackItem {...item} />
              )}
            </div>
          </div>
        </FadeIn>
      );
    });
  }, [data, loading, palette]);
  //#endregion

  // main render
  return (
    <React.Fragment>
      <Container className="body-container">
        <div
          style={{
            padding: "3rem",
            borderRadius: "10px",
            backgroundColor: palette.primary.light,
            boxShadow: "2px 2px 10px 1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            style={{ fontFamily: "monospace" }}
          >
            {state.user ? state.user?.display_name : ""}'s Top{" "}
            {capitalize(type)}
          </Typography>
          <TransitionGroup
            style={{ paddingTop: "2rem" }}
            id="top-artists-tracks-tsg"
          >
            {mapRenderTops()}
          </TransitionGroup>
        </div>
      </Container>
    </React.Fragment>
  );
};

TopArtistsAndTracks.propTypes = {
  type: PropTypes.oneOf(["artists", "tracks"]),
};

TopArtistsAndTracks.defaultProps = {
  type: "artists",
};
