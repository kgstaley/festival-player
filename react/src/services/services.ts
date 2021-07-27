import client from "./axiosClient";
const rootApi = `http://localhost:5000/api`;
const log = console.log;

export const authService = async () => {
  try {
    const config = {
      url: `${rootApi}/auth`,
      method: "GET",
    };

    const res = await client(config);

    log("res is", res);

    return res;
  } catch (err) {
    log("error thrown in authService", err);
    throw new Error(err);
  }
};
