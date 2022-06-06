import "dotenv/config";
import {Scenes, session, Telegraf} from "telegraf";
import {registerScene} from "./register/RegisterScene";

const bot = new Telegraf(process.env.BOT_TOKEN || "");

// const superWizard = new Scenes.WizardScene(
//     "super-wizard",
//     (ctx: any) => {
//         ctx.reply("Step 1", Markup.inlineKeyboard([Markup.button.url("❤️", "http://telegraf.js.org"), Markup.button.callback("➡️ Next", "next")]));
//         return ctx.wizard.next();
//     },
//     async ctx => {
//         ctx.reply("Step 2");
//         return ctx.wizard.next();
//     },
//     ctx => {
//         console.log(ctx.message?.text);
//         ctx.reply("Done");
//         return ctx.scene.leave();
//     }
// );

const stage: any = new Scenes.Stage([registerScene as any]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter("register"));

// bot.command("me", ctx => {
//     console.log(ctx.message.from.username);
//     ctx.reply("Welcome");
// });

// bot.hears("fuck", Scenes.Stage.enter("super-wizard") as any);

// bot.help(ctx => ctx.reply("Send me a sticker"));
// bot.on("sticker", ctx => ctx.reply("👍"));
// bot.hears("hi", ctx => ctx.reply("Hey there"));

bot.launch({
    webhook: {
        hookPath: "/webhook",
        port: 5000,
    },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
