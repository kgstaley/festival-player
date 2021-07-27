import client from "./axiosClient";
import { logger, envs, generateRandomString } from "../common-util";

const rootApi = `http://localhost:5000/auth`;

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

export const auth = async () => {
  try {
    const config = {
      url: `${rootApi}`,
    };

    const res = await client(config);

    logger("res for auth", res);

    return res;
  } catch (err) {
    logger("err", err);
    throw err;
  }
};

export const login = async () => {
  try {
    // const state = generateRandomString(16);

    const config = {
      url: `${rootApi}/login/success`,
      method: "GET",
    };
    const res = await client(config);
    logger("res", res);

    return res;
  } catch (err) {
    logger("error thrown in spotify login", err);
    throw err;
  }
};

export const getMe = async () => {
  try {
    const config = { url: `${rootApi}/me` };
    const { data } = await client(config);
    return data;
  } catch (err) {
    logger("error thrown in getMe", err);
    throw err;
  }
};
