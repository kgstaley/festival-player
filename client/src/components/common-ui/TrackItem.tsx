import { Typography, useTheme } from "@material-ui/core";
import React from "react";
import { Track } from "../../interfaces";

const _Track = (props: Track) => {
  const theme = useTheme();
  const { palette } = theme;

  const { album, artists } = props;

  const avatar =
    album?.images && album?.images.length > 0 ? album?.images[0].url : "";

  // main render
  return (
    <React.Fragment>
      <div className="avatar-container">
        <img className="avatar" src={avatar} alt={props.name} />
      </div>
      <div
        className="flex flex-col"
        style={{
          // border: "3px red solid",
          justifyContent: "flex-end",
          textAlign: "end",
        }}
      >
        <Typography
          variant="h4"
          component="h4"
          style={{
            color: palette.info.light,
            fontFamily: "monospace",
            paddingBottom: "0.5rem",
          }}
        >
          {props.name}
        </Typography>
        <div
          className="flex flex-col"
          style={{
            fontWeight: 300,
            fontFamily: "monospace",
            fontSize: "12px",
            color: palette.info.light,
            justifyContent: "flex-end",
            textAlign: "end",
          }}
        >
          <span>Type: {album?.album_type}</span>
          <div>
            Artists:{" "}
            {artists?.map((a) => (
              <div key={a.name}>{a.name}</div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const TrackItem = React.memo(_Track);
