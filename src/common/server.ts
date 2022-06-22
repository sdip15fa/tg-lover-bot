import express from "express";
import {Telegraf} from "telegraf/src/telegraf";

const app = express();

export const server = (bot: any) => {
    app.use(bot.webhookCallback("/"));
    app.listen(5000, () => console.log("TG Lover Bot listening on port 5000!"));

    // Enable graceful stop
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
