"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const crypto_1 = require("crypto");
exports.DB = {
    posts: [
        { id: (0, crypto_1.randomUUID)(),
            title: "Little",
            shortDescription: "Nighmare in the city",
            content: "This video is about",
            blogId: "12345435",
            blogName: "string" }
    ],
    blogs: [
        {
            id: (0, crypto_1.randomUUID)(),
            name: "a little bit",
            description: "shortcut",
            websiteUrl: "https://asda"
        }
    ]
};
