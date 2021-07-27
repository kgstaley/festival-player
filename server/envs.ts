const stateKey: string = "spotify_auth_state";
const redirectUri: string = "http://localhost:8080/auth/callback";
const clientId: string = process.env.SPOTIFY_ID;
const clientSecret: string = process.env.SPOTIFY_SECRET;

const envs = {
  stateKey,
  redirectUri,
  clientId,
  clientSecret,
};

export default envs;
