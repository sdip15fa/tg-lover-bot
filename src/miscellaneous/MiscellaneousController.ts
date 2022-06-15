import {Singleton} from "typescript-ioc";

@Singleton
export class MiscellaneousController {
    donate = async ctx => {
        await ctx.reply("如果您錢多到無掟使，可以經以下連結捐啲畀我🤑\nhttps://www.buymeacoffee.com/chongsaulo\n\nby @internal_server_error");
    };

    feedback = async ctx => {
        await ctx.reply("如有任何問題，請自行聯絡 @internal_server_error");
    };
}
