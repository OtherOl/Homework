import {randomUUID} from "crypto";

export let DB = {
    posts: [
        {id: randomUUID(),
        title: "Little",
        shortDescription: "Nighmare in the city",
        content: "This video is about",
        blogId: "12345435",
        blogName: "string"}
    ],

    blogs: [
        {
            id: randomUUID(),
            name: "a little bit",
            description: "shortcut",
            websiteUrl: "https://asda"
        }
    ]
}
