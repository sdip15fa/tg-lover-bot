import {Scenes, session, Telegraf} from "telegraf";
import {registerScene} from "./register/RegisterScene";
import {Container} from "typescript-ioc";
import {MatchController} from "./match/MatchController";
import express from "express";
import {UserController} from "./user/UserController";
import {MiscellaneousController} from "./miscellaneous/MiscellaneousController";

require("dotenv").config();

const matchController = Container.get(MatchController);
const userController = Container.get(UserController);
const miscellaneousController = Container.get(MiscellaneousController);

const bot = new Telegraf(process.env.BOT_TOKEN || "");

const stage: any = new Scenes.Stage([registerScene as any]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter("register"));

bot.command("register", (ctx: any) => ctx.scene.enter("register"));
bot.command("match", matchController.match);
bot.command("recent_liked", matchController.recentLikedUsers);
bot.command("recent_matched", matchController.recentMatchedUsers);
bot.command("update_info", userController.askForUserInfo);
bot.command("upload_photos", userController.askForUploadPhotos);
bot.command("clear_photos", userController.clearPhotos);
bot.command("update_filter", userController.askForFilter);
bot.command("my_info", userController.myInfo);
bot.command("my_filter", userController.myFilter);
bot.command("donate", miscellaneousController.donate);
bot.command("feedback", miscellaneousController.feedback);

bot.action(/MATCH_LIKE#(.+)/, matchController.like);
bot.action(/MATCH_DISLIKE#(.+)/, matchController.dislike);

bot.hears(/^#自我介紹/g, userController.updateUserInfo);
bot.hears(/^#配對條件/g, userController.updateFilter);

bot.on("message", async ctx => {
    const hasPhoto = Boolean((ctx as any)?.message?.photo);

    if (hasPhoto) {
        await userController.uploadPhotos(ctx);
        return;
    }
});

const app = express();
app.use(bot.webhookCallback("/"));

app.listen(5000, () => console.log("TG Lover bot listening on port 5000!"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
