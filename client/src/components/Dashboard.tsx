import { Container, TextField, Typography, useTheme } from "@material-ui/core";
import { debounce } from "lodash";
import React, { BaseSyntheticEvent, useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { TransitionGroup } from "react-transition-group";
import { logger } from "../common-util";
import { Album, Artist, Track } from "../interfaces";
import { search } from "../services";
import { FadeIn } from "./common-ui";

const Dashboard = (_props: any) => {
  const theme = useTheme();
  const { palette } = theme;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [artists, setArtists]: [artists: Array<Artist>, setArtists: any] =
    useState([]);
  const [tracks, setTracks]: [tracks: Array<Track>, setTracks: any] = useState(
    []
  );
  const [albums, setAlbums]: [albums: Array<Album>, setAlbums: any] = useState(
    []
  );
  const [offset] = useState(0);
  const [limit] = useState(10);
  const [types] = useState(["artist", "album", "track"]);

  //#region api calls
  const fetchSearchResults = useCallback(async () => {
    try {
      if (loading || !!!query.length) return;
      logger("firing fetch search results");
      setLoading(true);
      const res = await search(query, types, limit, offset);
      if (!res) {
        throw new Error("no data returned from search");
      }

      const { artists, tracks, albums } = res;

      setArtists(artists.items);
      setAlbums(albums.items);
      setTracks(tracks.items);
      return res;
    } catch (err) {
      logger("error thrown in fetchSearchResults", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [query, types, limit, offset, loading]);
  //#endregion

  const debouncedSearch = useCallback(() => {
    logger("firing debounced search");
    debounce(fetchSearchResults, 1000)();
  }, [fetchSearchResults]);

  const handleSearchChange = useCallback(
    (e: BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setQuery(e.target.value);
      debouncedSearch();
    },
    [debouncedSearch]
  );

  const handleKeyUp = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.KeyCode === "enter") {
        logger("enter pressed");
        setQuery(e.target.value);
        fetchSearchResults();
      }
    },
    [fetchSearchResults]
  );

  const renderSearchBox = useCallback(() => {
    return (
      <React.Fragment>
        <div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for an artist, track or album"
            onChange={handleSearchChange}
            value={query}
            type="text"
            onKeyUp={handleKeyUp}
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
  }, [query, handleSearchChange, palette, loading, handleKeyUp]);

  const renderArtistPaper = useCallback((artist: Artist, index: number) => {
    if (!artist) return null;

    const avatar = artist.images?.length ? artist.images[0].url : "";

    return (
      <FadeIn in key={artist.name + index.toString()}>
        <div className="flex flex-1 flex-row">
          <div
            className="flex flex-1 flex-col"
            style={{
              justifyContent: "center",
              height: "14rem",
              width: "14rem",
              maxHeight: "14rem",
              maxWidth: "14rem",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <img className="flex flex-1" src={avatar} alt={artist.name} />
          </div>
          {/* <div>{artist.name}</div> */}
        </div>
      </FadeIn>
    );
  }, []);

  const renderArtists = useCallback(() => {
    if (!!!artists.length) return null;

    return (
      <TransitionGroup
        id="artists-tsg"
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {artists.map(renderArtistPaper)}
      </TransitionGroup>
    );
  }, [renderArtistPaper, artists]);

  const renderTracks = useCallback(() => {
    if (!!!tracks.length) return null;

    return (
      <TransitionGroup id="tracks-tsg">
        <FadeIn in key="tracks-ts">
          {tracks.map((track) => (
            <div>{track.name}</div>
          ))}
        </FadeIn>
      </TransitionGroup>
    );
  }, [tracks]);

  const renderAlbum = useCallback((album: Album, index: number) => {
    return (
      <FadeIn in key={album.name + index.toString()}>
        <div>
          <span>{album.name}</span>
        </div>
      </FadeIn>
    );
  }, []);

  const renderAlbums = useCallback(() => {
    if (!!!albums.length) return null;

    return (
      <TransitionGroup id="albums-tsg">
        {albums.map(renderAlbum)}
      </TransitionGroup>
    );
  }, [albums, renderAlbum]);

  // main render
  return (
    <React.Fragment>
      <Helmet>
        <title>festival.me - Dashboard</title>
      </Helmet>
      <Container style={{ minHeight: "80vh" }}>
        <div className="body-container">
          <TransitionGroup id="dashboard-transition-group">
            <FadeIn in key="dashboard-container">
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
            </FadeIn>
          </TransitionGroup>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            border: "3px purple solid",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              border: "3px blue solid",
            }}
          >
            <Typography variant="h5" component="h5">
              Artists:
            </Typography>
            {renderArtists()}
          </div>
          <div>
            <Typography variant="h5" component="h5">
              Albums:
            </Typography>
            {renderAlbums()}
          </div>
          <div>
            <Typography variant="h5" component="h5">
              Tracks:
            </Typography>
            {renderTracks()}
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
