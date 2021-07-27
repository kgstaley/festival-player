import client from "./axiosClient";
const rootApi = `http://localhost:5000`;
const log = console.log;

export const authService = async () => {
  try {
    const config = {
      url: `${rootApi}/auth`,
      method: "GET",
    };

    const { data } = await client(config);

    return data;
  } catch (err) {
    log("error thrown in authService", err);
    throw new Error(err);
  }
};

export const getToken = async (code?: string, state?: string) => {
  try {
    const config = {
      url: `${rootApi}/auth/callback?code=${code}&state=${state}`,
      method: "GET",
    };

    const { data } = await client(config);

    return data;
  } catch (err) {
    log("error thrown in getToken", err);
    throw new Error(err);
  }
};
