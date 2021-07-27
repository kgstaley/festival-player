interface User {
  id: string;
  name: string;
  email: string;
  spotifyId: string;
  accessToken: string;
  accessTokenExpiry: Date;
  refreshToken: string;
}
