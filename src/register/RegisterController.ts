import {Markup} from "telegraf";
import {RegisterAction} from "./RegisterAction";
import {RegisterMessages} from "./RegisterMessages";
import {registerService} from "./RegisterService";

class RegisterController {
    enterScene = async ctx => {
        const agreedTerms = await registerService.isAgreeTerms(ctx.from.id);

        if (agreedTerms) {
            await this.usernamePermission(ctx);
            return;
        }

        await ctx.reply(RegisterMessages.TERMS, {
            ...Markup.inlineKeyboard([
                Markup.button.callback(RegisterMessages.AGREE_TERMS, RegisterAction.AGREE_TERMS),
                Markup.button.callback(RegisterMessages.DISAGREE_TERMS, RegisterAction.DISAGREE_TERMS),
            ]),
            parse_mode: "HTML",
        });
    };

    disagreeTerms = async ctx => {
        await ctx.reply(RegisterMessages.DISAGREE_TERMS_ERROR);
        await ctx.scene.leave();
    };

    usernamePermission = async ctx => {
        const agreedUsernamePermission = await registerService.isAgreeUsernamePermission(ctx.from.id);
        if (agreedUsernamePermission) {
            await this.createInfo(ctx);
            return;
        }

        const username = ctx.from.username;

        await ctx.reply(
            RegisterMessages.USERNAME_PERMISSION_CONFIRM(username),
            Markup.inlineKeyboard([
                Markup.button.callback(RegisterMessages.AGREE, RegisterAction.AGREE_USERNAME_PERMISSION),
                Markup.button.callback(RegisterMessages.DISAGREE, RegisterAction.DISAGREE_USERNAME_PERMISSION),
            ])
        );
    };

    disagreeUsernamePermission = async ctx => {
        await ctx.reply(RegisterMessages.DISAGREE_USERNAME_PERMISSION_ERROR);
        await ctx.scene.leave();
    };

    createInfo = async ctx => {
        await ctx.reply("hello");
    };
}

export const registerController = new RegisterController();
