const clientId = process.env.REACT_APP_SPOTIFY_ID;
const secret = process.env.REACT_APP_SPOTIFY_SECRET;
const redirectUri = "http://localhost:8080/auth/callback/";

const envs = {
  clientId,
  secret,
  redirectUri,
};

export default envs;