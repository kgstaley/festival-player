import client from "./axiosClient";
import { logger, envs, generateRandomString } from "../common-util";

const rootApi = `http://localhost:5000/api`;

const scope = "user-read-email";

export const getLoginUrl = () => {
  const state = generateRandomString(16);

  const loginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
    envs.clientId
  }&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(
    envs.redirectUri
  )}&state=${state}&showDialog=true`;

  logger("credentials", {
    id: envs.clientId,
    secret: envs.secret,
    redirect: envs.redirectUri,
  });

  return loginUrl;
};

export const login = async (code: string) => {
  try {
    // const state = generateRandomString(16);

    const config = {
      url: `${rootApi}/login`,
      method: "POST",
      data: {
        code,
        grant_type: "authorization_code",
        redirectUri: envs.redirectUri,
      },
    };

    const res = await client(config);

    logger("res", res);

    return res;
  } catch (err) {
    logger("error thrown in spotify login", err);
    throw err;
  }
};
