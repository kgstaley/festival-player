"use-strict";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants");
dotenv_1.default.config();
const router = express_1.default.Router();
const spotifyApi = new spotify_web_api_node_1.default(constants_1.credentials);
const scope = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "user-top-read",
];
router.get("/hello", (req, res) => {
    res.send("hello world");
});
router.get("/auth", (req, res) => {
    const state = helpers_1.generateRandomString(16);
    const url = spotifyApi.createAuthorizeURL(scope, state);
    res.redirect(url);
});
router.get("/auth/callback", (req, res) => {
    const { code } = req.query;
    spotifyApi
        .authorizationCodeGrant(code.toString())
        .then((data) => {
        helpers_1.logger("data.body", data.body);
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        res.redirect("/dashboard");
    })
        .catch((err) => {
        helpers_1.logger(err);
        res.sendStatus(400);
    });
});
router.get("/auth/me", (req, res) => {
    spotifyApi
        .getMe()
        .then((data) => {
        helpers_1.logger("data.body", data.body);
        res.json(data.body);
    })
        .catch((err) => {
        helpers_1.logger(err);
        res.sendStatus(400);
    });
});
router.get("/auth/login/success", (req, res) => {
    helpers_1.logger("req.user in login success", req.user);
    if (req.user) {
        res.json({
            success: true,
            message: "Authentication success",
            user: req.user,
        });
    }
    else {
        res.sendStatus(403);
    }
});
exports.default = router;
//# sourceMappingURL=router.js.map