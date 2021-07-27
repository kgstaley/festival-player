import client from "./axiosClient";
import { logger } from "../common-util";

const rootApi = `http://localhost:5000/auth`;

export const auth = async () => {
  try {
    const config = { url: `${rootApi}` };
    await client(config);
  } catch (err) {
    logger("err", err);
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
