"use-strict";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.generateRandomString = void 0;
const generateRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.generateRandomString = generateRandomString;
// tslint:disable-next-line:no-console
exports.logger = console.log;
//# sourceMappingURL=helpers.js.map