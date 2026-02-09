const clientId = import.meta.env.VITE_SPOTIFY_ID;
const secret = import.meta.env.VITE_SPOTIFY_SECRET;
const redirectUri = "http://localhost:5000/api/auth/callback";

const envs = {
  clientId,
  secret,
  redirectUri,
};

export default envs;
