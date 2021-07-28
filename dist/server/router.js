"use-strict";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const index_1 = require("./index");
dotenv_1.default.config();
const router = express_1.default.Router();
const spotifyWebApi = new spotify_web_api_node_1.default(index_1.credentials);
const scope = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "user-top-read",
    "playlist-modify-private",
];
// test ping
router.get("/hello", (req, res) => {
    res.send("hello world");
});
//#region spotify auth
router.get("/auth", (req, res) => {
    const state = index_1.generateRandomString(16);
    const url = spotifyWebApi.createAuthorizeURL(scope, state);
    res.redirect(url);
});
router.get("/auth/callback", (req, res) => {
    const { code } = req.query;
    spotifyWebApi
        .authorizationCodeGrant(code.toString())
        .then((data) => {
        index_1.logger("data.body", data.body);
        spotifyWebApi.setAccessToken(data.body.access_token);
        spotifyWebApi.setRefreshToken(data.body.refresh_token);
        res.redirect("http://localhost:8080/dashboard");
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.status);
    });
});
router.get("/auth/me", (req, res) => {
    spotifyWebApi
        .getMe()
        .then((data) => {
        index_1.logger("data.body", data.body);
        res.json(data.body);
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.statusCode);
    });
});
//#endregion
//#region spotify api calls
// get several tracks based on track spotify id (querystring) with max of 50 at a time
router.get(`/spotify/tracks`, (req, res) => {
    if (!req.body)
        res.sendStatus(400);
    const { ids, market } = req.body;
    index_1.logger("market is (country code)", market);
    index_1.logger("spotify track ids are ", ids);
    spotifyWebApi
        .getTracks(ids, market)
        .then((data) => {
        index_1.logger("data returned for getTracks from spotify web api", data);
        res.json(data.body.tracks);
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.statusCode);
    });
});
// search
router.get(`/spotify/search`, (req, res) => {
    if (!req.body)
        res.sendStatus(400);
    const { q, type, market, limit = 25, offset = 0 } = req.body;
    const options = { market, limit, offset };
    spotifyWebApi
        .search(q, type, options)
        .then((data) => {
        index_1.logger("data from search", data);
        res.json(data.body);
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.statusCode);
    });
});
// create a private playlist
router.post(`/spotify/playlist/users/:userId/new`, (req, res) => {
    const { userId } = req.params;
    if (!userId)
        res.sendStatus(400);
    if (!req.body)
        res.sendStatus(400);
    const { name, description } = req.body;
    index_1.logger("name and description are", { name, description });
    const options = { description, public: false };
    spotifyWebApi
        .createPlaylist(name, options)
        .then((data) => {
        index_1.logger("data from create playlist", data);
        res.json(data.body);
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.statusCode);
    });
});
// get list of current user's playlists
router.get("/spotify/playlists/user/:userId", (req, res) => {
    const { userId } = req.params;
    if (!userId)
        res.sendStatus(400);
    const { offset, limit } = req.body;
    spotifyWebApi
        .getUserPlaylists({ offset, limit })
        .then((data) => {
        index_1.logger("data for get current user playlists", data);
        res.json(data.body);
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.statusCode);
    });
});
// get a playlist
router.get("/spotify/playlist/:playlistId", (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId)
        res.sendStatus(400);
    const { market } = req.body;
    const options = { market };
    spotifyWebApi
        .getPlaylist(playlistId, options)
        .then((data) => {
        index_1.logger("data returned from get playlist", data);
        res.json(data.body);
    })
        .catch((err) => {
        index_1.logger(err);
        res.sendStatus(res.statusCode);
    });
});
// get users top artists and tracks
router.get("/spotify/me/top/:type", (req, res) => {
    const { type } = req.params;
    const { timeRange, offset = 0, limit = 10 } = req.body;
    if (!type)
        res.sendStatus(res.statusCode);
    if (type === "artists") {
        spotifyWebApi
            .getMyTopArtists({ time_range: timeRange, offset, limit })
            .then((data) => {
            index_1.logger("data for get my top artists", data);
            res.json(data.body);
        })
            .catch((err) => {
            index_1.logger(err);
            res.sendStatus(res.statusCode);
        });
    }
    else if (type === "tracks") {
        spotifyWebApi
            .getMyTopTracks({ time_range: timeRange, offset, limit })
            .then((data) => {
            index_1.logger("data for get my top tracks", data);
            res.json(data.body);
        })
            .catch((err) => {
            index_1.logger(err);
            res.sendStatus(res.statusCode);
        });
    }
});
//#endregion
exports.default = router;
//# sourceMappingURL=router.js.map