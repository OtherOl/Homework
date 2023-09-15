"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 4000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    let helloWorld = "Hello, let's talk about our code?";
    res.send(helloWorld);
});
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
