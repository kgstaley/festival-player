'use-strict';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./server/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const start = () => {
    try {
        app.use((0, cors_1.default)());
        app.use((0, body_parser_1.json)());
        app.use((0, body_parser_1.urlencoded)({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        // set api prefix for node endpoints
        app.use('/api', index_1.router);
        // set path for react
        app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'build')));
        // serve react from express for auth to avoid error on cors redirect to spotify auth
        app.get('/', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, '..', 'client', 'build', 'index.html'));
        });
        app.listen(port, () => {
            (0, index_1.logger)(`Express up and listening on port ${port}`);
        });
    }
    catch (err) {
        (0, index_1.logger)('error thrown in start server', err);
        process.on('uncaughtException', () => app.removeListener(port, () => {
            (0, index_1.logger)('removing port listener and closing express');
        }));
    }
};
start();
//# sourceMappingURL=server.js.map