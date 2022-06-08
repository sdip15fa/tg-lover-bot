import "dotenv/config";
import {Scenes, session, Telegraf} from "telegraf";
import {registerScene} from "./register/RegisterScene";

const bot = new Telegraf(process.env.BOT_TOKEN || "");

const stage: any = new Scenes.Stage([registerScene as any]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter("register"));
bot.command("register", (ctx: any) => ctx.scene.enter("register"));

bot.command("asdasdsme", ctx => {
    // ctx.replyWithMarkdownV2()
    // console.log(ctx.message.from.username);
    // ctx.reply("Welcome");
});

// bot.hears("fuck", Scenes.Stage.enter("super-wizard") as any);

// bot.help(ctx => ctx.reply("Send me a sticker"));
// bot.on("sticker", ctx => ctx.reply("👍"));
// bot.hears("hi", ctx => ctx.reply("Hey there"));

// bot.telegram.sendMessage("234392020", "AAA");

bot.launch({
    webhook: {
        hookPath: "/",
        port: 5000,
    },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
