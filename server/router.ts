"use-strict";
import express from "express";
import { generateRandomString, logger } from "./helpers";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
import { credentials } from "./constants";

dotenv.config();
const router = express.Router();
const spotifyApi = new SpotifyWebApi(credentials);
const scope = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-top-read",
];

router.get("/hello", (req: any, res: any) => {
  res.send("hello world");
});

router.get("/auth", (req, res) => {
  const state = generateRandomString(16);
  const url = spotifyApi.createAuthorizeURL(scope, state);
  res.redirect(url);
});

router.get("/auth/callback", (req, res) => {
  const { code } = req.query;
  spotifyApi
    .authorizationCodeGrant(code.toString())
    .then((data) => {
      logger("data.body", data.body);
      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
      res.redirect("http://localhost:8080/dashboard");
    })
    .catch((err) => {
      logger(err);
      res.sendStatus(400);
    });
});

router.get("/auth/me", (req, res) => {
  spotifyApi
    .getMe()
    .then((data) => {
      logger("data.body", data.body);
      res.json(data.body);
    })
    .catch((err) => {
      logger(err);
      res.sendStatus(400);
    });
});

router.get("/auth/login/success", (req: any, res) => {
  logger("req.user in login success", req.user);
  if (req.user) {
    res.json({
      success: true,
      message: "Authentication success",
      user: req.user,
    });
  } else {
    res.sendStatus(403);
  }
});

export default router;
