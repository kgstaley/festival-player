"use-strict";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
// tslint:disable-next-line:no-console
const log = console.log;

const port = process.env.PORT;
const spotifyUrl = process.env.SPOTIFY_URL;

//#region routes
const router = express.Router();
router.get("/", (req: any, res: any) => {
  res.send("home");
});

router.get("/hello", (req: any, res: any) => {
  res.send("hello world");
});

router.get("/auth", (req: any, res: any) => {
  log("get auth triggered");
  const scopes = "user-read-private user-read-email";
  const authorizeSpotify = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
    process.env.SPOTIFY_ID
  }&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
    `http://localhost:5000/api/callback`
  )}`;
  log("url", authorizeSpotify);
  res.redirect(authorizeSpotify);
});

router.get("/callback", (req: any, res: any) => {
  log("req is ", req);
});
//#endregion

const start = () => {
  try {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use("/api", router);
    app.listen(port, () => {
      log(`Express up and listening on port ${port}`);
    });
  } catch (err) {
    log("error thrown in start server", err);
  }
};
start();
