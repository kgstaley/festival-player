import express from "express";
import { logger } from "./helpers";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const credentials = {
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};

logger("credentials are ", credentials);

router.get("/", (req: any, res: any) => {
  res.send("home");
});

router.get("/hello", (req: any, res: any) => {
  res.send("hello world");
});

router.post("/login", (req, res) => {
  const spotifyApi = new SpotifyWebApi(credentials);

  const { code } = req.body;

  logger("code is ", code);

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({ accessToken: data.body.access_token });
    })
    .catch((err) => {
      logger(err);
      res.sendStatus(400);
    });
});

export default router;
