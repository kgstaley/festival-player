"use-strict";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { logger } from "./server/helpers";
import router from "./server/router";

dotenv.config();
const app = express();
const port = process.env.PORT;

const start = () => {
  try {
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use("/", router);
    // set path for react
    app.use(express.static(path.join(__dirname, "..", "client", "build")));

    // serve react from express
    app.get("/", (req: any, res: any) => {
      res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });

    app.get("/redirect", (req: any, res: any) => {
      res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });

    app.listen(port, () => {
      logger(`Express up and listening on port ${port}`);
    });
  } catch (err) {
    logger("error thrown in start server", err);
  }
};
start();
