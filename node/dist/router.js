"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const querystring_1 = __importDefault(require("querystring"));
const request_1 = __importDefault(require("request"));
const envs_1 = __importDefault(require("./envs"));
const helpers_1 = require("./helpers");
const scope = [
    "user-read-private",
    "user-read-email",
    "playlst-read-private",
    "user-top-read",
];
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("home");
});
router.get("/hello", (req, res) => {
    res.send("hello world");
});
router.get("/auth", (req, res) => {
    helpers_1.logger("get auth triggered");
    const state = helpers_1.generateRandomString(16);
    res.cookie(envs_1.default.stateKey, state);
    const scopes = "user-read-private user-read-email";
    const authorizeSpotify = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(envs_1.default.redirectUri)}&state=${state}`;
    res.redirect(authorizeSpotify);
});
router.get("/auth/callback", (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter
    helpers_1.logger("get user bearer token from spotify");
    const code = req.query.code || null;
    helpers_1.logger("code is ", code);
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[envs_1.default.stateKey] : null;
    if (state === null || state !== storedState) {
        res.redirect("/#" +
            querystring_1.default.stringify({
                error: "state_mismatch",
            }));
    }
    else {
        res.clearCookie(envs_1.default.stateKey);
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code,
                redirect_uri: envs_1.default.redirectUri,
                grant_type: "authorization_code",
            },
            headers: {
                Authorization: "Basic " +
                    new Buffer(envs_1.default.clientId + ":" + envs_1.default.clientSecret).toString("base64"),
            },
            json: true,
        };
        request_1.default.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const accessToken = body.access_token;
                const refreshToken = body.refresh_token;
                const options = {
                    url: "https://api.spotify.com/v1/me",
                    headers: { Authorization: "Bearer " + accessToken },
                    json: true,
                };
                // use the access token to access the Spotify Web API
                request_1.default.get(options, (error2, response2, body2) => {
                    helpers_1.logger(body2);
                });
                // we can also pass the token to the browser to make requests from there
                res.redirect("/#" +
                    querystring_1.default.stringify({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    }));
            }
            else {
                res.redirect("/#" +
                    querystring_1.default.stringify({
                        error: "invalid_token",
                    }));
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=router.js.map