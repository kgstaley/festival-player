import { Typography, useTheme } from "@material-ui/core";
import React from "react";
import { Artist } from "../../interfaces";

const _Artist = (props: Artist) => {
  const theme = useTheme();
  const { palette } = theme;

  const avatar =
    props.images && props.images.length > 0 ? props.images[0].url : "";
  // main render
  return (
    <React.Fragment>
      <div className="avatar-container">
        <img className="avatar" src={avatar} alt={props.name} />
      </div>
      <div
        className="flex flex-col"
        style={{
          //   border: "3px red solid",
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
          <span>Followers: {props.followers?.total?.toString() || ""}</span>
          <div>
            Genres:{" "}
            {props.genres?.map((g) => (
              <span>{g}, </span>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const ArtistItem = React.memo(_Artist);
