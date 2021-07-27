"use-strict";
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
const helpers_1 = require("./server/helpers");
const router_1 = __importDefault(require("./server/router"));
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT;
const start = () => {
    try {
        app.use(cors_1.default());
        app.use(body_parser_1.json());
        app.use(body_parser_1.urlencoded({ extended: true }));
        app.use(cookie_parser_1.default());
        app.use("/api", router_1.default);
        // set path for react
        app.use(express_1.default.static(path_1.default.join(__dirname, "..", "client", "build")));
        // serve react from express
        app.get("/", (req, res) => {
            res.sendFile(path_1.default.join(__dirname, "..", "client", "build", "index.html"));
        });
        // app.get("/dashboard", (req: any, res: any) => {
        //   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
        // });
        app.listen(port, () => {
            helpers_1.logger(`Express up and listening on port ${port}`);
        });
    }
    catch (err) {
        helpers_1.logger("error thrown in start server", err);
    }
};
start();
//# sourceMappingURL=server.js.map