"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const credentials = {
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: process.env.REDIRECT_URI,
};
helpers_1.logger("credentials are ", credentials);
router.get("/", (req, res) => {
    res.send("home");
});
router.get("/hello", (req, res) => {
    res.send("hello world");
});
router.post("/login", (req, res) => {
    const spotifyApi = new spotify_web_api_node_1.default(credentials);
    const { code } = req.body;
    helpers_1.logger("code is ", code);
    spotifyApi
        .authorizationCodeGrant(code)
        .then((data) => {
        res.json({ accessToken: data.body.access_token });
    })
        .catch((err) => {
        helpers_1.logger(err);
        res.sendStatus(400);
    });
});
exports.default = router;
//# sourceMappingURL=router.js.map