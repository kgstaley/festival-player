import express from "express";
import querystring from "querystring";
import request from "request";
import env from "./envs";
import { generateRandomString, logger } from "./helpers";

const scope = [
  "user-read-private",
  "user-read-email",
  "playlst-read-private",
  "user-top-read",
];

const router = express.Router();

router.get("/", (req: any, res: any) => {
  res.send("home");
});

router.get("/hello", (req: any, res: any) => {
  res.send("hello world");
});

router.get("/auth", (req: any, res: any) => {
  logger("get auth triggered");
  const state = generateRandomString(16);
  res.cookie(env.stateKey, state);
  const scopes = "user-read-private user-read-email";
  const authorizeSpotify = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
    process.env.SPOTIFY_ID
  }&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
    env.redirectUri
  )}&state=${state}`;
  res.redirect(authorizeSpotify);
});

router.get("/auth/callback", (req: any, res: any) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  logger("get user bearer token from spotify");

  const code = req.query.code || null;
  logger("code is ", code);
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[env.stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(env.stateKey);
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code,
        redirect_uri: env.redirectUri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(env.clientId + ":" + env.clientSecret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, (error: any, response: any, body: any) => {
      if (!error && response.statusCode === 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;

        const options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + accessToken },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error2: any, response2: any, body2: any) => {
          logger(body2);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/#" +
            querystring.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

export default router;
