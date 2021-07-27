import dotenv from "dotenv";
dotenv.config();
export const credentials = {
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};
