"use-strict";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = express_1.default();
// tslint:disable-next-line:no-console
const log = console.log;
const port = process.env.PORT;
const spotifyUrl = process.env.SPOTIFY_URL;
//#region routes
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("home");
});
router.get("/hello", (req, res) => {
    res.send("hello world");
});
router.get("/auth", (req, res) => {
    log("get auth triggered");
    const scopes = "user-read-private user-read-email";
    const authorizeSpotify = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(`http://localhost:5000/api/callback`)}`;
    log("url", authorizeSpotify);
    res.redirect(authorizeSpotify);
});
router.get("/callback", (req, res) => {
    log("req is ", req);
});
//#endregion
const start = () => {
    try {
        app.use(cors_1.default());
        app.use(body_parser_1.json());
        app.use(body_parser_1.urlencoded({ extended: false }));
        app.use("/api", router);
        app.listen(port, () => {
            log(`Express up and listening on port ${port}`);
        });
    }
    catch (err) {
        log("error thrown in start server", err);
    }
};
start();
//# sourceMappingURL=index.js.map