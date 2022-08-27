const clientId = process.env.REACT_APP_SPOTIFY_ID;
const secret = process.env.REACT_APP_SPOTIFY_SECRET;
const redirectUri = 'http://localhost:5001/api/auth/callback';

const envs = {
    clientId,
    secret,
    redirectUri,
};

export default envs;
