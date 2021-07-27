"use-strict";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { logger } from "./helpers";
import router from "./router";

dotenv.config();
const app = express();
const port = process.env.PORT;

const start = () => {
  try {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use("/api", router);
    app.listen(port, () => {
      logger(`Express up and listening on port ${port}`);
    });
  } catch (err) {
    logger("error thrown in start server", err);
  }
};
start();
