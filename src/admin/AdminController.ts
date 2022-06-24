import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../user/service/UserService";

@Singleton
export class AdminController {
    constructor(
        @Inject
        private readonly userService: UserService
    ) {}

    authCheck = async ctx => {
        return Number(ctx.from.id) === Number(process.env.ADMIN_ID);
    };

    block = async ctx => {
        if (!(await this.authCheck(ctx))) return;

        const [, username] = ctx.update.message.text.split("@");

        const user = await this.userService.findByUsername(username);

        if (!user) {
            await ctx.reply("User not found");
            return;
        }

        await this.userService.updateUserData(user.telegramId, {blocked: true});
        await ctx.reply(`User blocked: @${user.username}`);
    };

    unblock = async ctx => {
        if (!(await this.authCheck(ctx))) return;

        const [, username] = ctx.update.message.text.split("@");

        const user = await this.userService.findByUsername(username);

        if (!user) {
            await ctx.reply("User not found");
            return;
        }

        await this.userService.updateUserData(user.telegramId, {blocked: false});
        await ctx.reply(`User unblocked: @${user.username}`);
    };
}
