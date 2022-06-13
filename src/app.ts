import "dotenv/config";
import {Scenes, session, Telegraf} from "telegraf";
import {registerScene} from "./register/RegisterScene";
import {Container} from "typescript-ioc";
import {MatchController} from "./match/MatchController";
import express from "express";

const matchController = Container.get(MatchController);

const bot = new Telegraf(process.env.BOT_TOKEN || "");

const stage: any = new Scenes.Stage([registerScene as any]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter("register"));

bot.command("register", (ctx: any) => ctx.scene.enter("register"));

bot.command("match", matchController.match);
bot.action(/MATCH_LIKE#(.+)/, matchController.like);
bot.action(/MATCH_DISLIKE#(.+)/, matchController.dislike);

// bot.hears("fuck", Scenes.Stage.enter("super-wizard") as any);

// bot.help(ctx => ctx.reply("Send me a sticker"));
// bot.on("sticker", ctx => ctx.reply("👍"));
// bot.hears("hi", ctx => ctx.reply("Hey there"));

// bot.telegram.sendMessage("234392020", "AAA");

const app = express();
app.use(bot.webhookCallback("/"));

app.listen(5000, () => {
    console.log("TG Lover bot listening on port 5000!");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
