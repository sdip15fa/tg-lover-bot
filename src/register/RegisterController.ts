import {ValidationError} from "class-validator";
import {Markup} from "telegraf";
import {Inject, Singleton} from "typescript-ioc";
import {UserInfoParser} from "../user/service/UserInfoParser";
import {RegisterAction} from "./constant/RegisterAction";
import {RegisterMessages} from "./constant/RegisterMessages";
import {RegisterService} from "./RegisterService";

@Singleton
export class RegisterController {
    constructor(
        @Inject
        private registerService: RegisterService,
        @Inject
        private userInfoParser: UserInfoParser
    ) {}

    enterScene = async ctx => {
        const agreedTerms = await this.registerService.isAgreeTerms(ctx.from.id);

        if (agreedTerms) {
            await this.askForUsernamePermission(ctx);
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

    askForUsernamePermission = async ctx => {
        const agreedUsernamePermission = await this.registerService.isAgreeUsernamePermission(ctx.from.id);

        if (agreedUsernamePermission) {
            await this.askForUserInfo(ctx);
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

    askForUserInfo = async ctx => {
        await ctx.replyWithMarkdownV2(RegisterMessages.USER_INFO_SCHEMA);
        await ctx.reply(RegisterMessages.USER_INFO_SAMPLE, {
            reply_markup: {force_reply: true, input_field_placeholder: "AAA"},
        });
    };

    agreeTerms = async ctx => {
        await this.registerService.agreeTerms(ctx.from.id);
        await this.askForUsernamePermission(ctx);
    };

    disagreeTerms = async ctx => {
        await this.registerService.disagreeTerms(ctx.from.id);
        await ctx.reply(RegisterMessages.DISAGREE_TERMS_ERROR);
        await ctx.scene.leave();
    };

    agreeUsernamePermission = async ctx => {
        await this.registerService.agreeUsernamePermission(ctx.from.id);
        await this.askForUserInfo(ctx);
    };

    disagreeUsernamePermission = async ctx => {
        await this.registerService.disagreeUsernamePermission(ctx.from.id);
        await ctx.reply(RegisterMessages.DISAGREE_USERNAME_PERMISSION_ERROR);
        await ctx.scene.leave();
    };

    createUserInfo = async ctx => {
        try {
            const userInfoYAML = ctx.match.input;
            await this.userInfoParser.parseYAML(userInfoYAML);
        } catch (e) {
            if (Array.isArray(e) && e[0] instanceof ValidationError) {
                const validationErrors: ValidationError[] = e;

                // validationErrors.map(v => v.)
            }

            console.log(e);
        }
        // const userInfoYAMLObject = yaml.parse(userInfoYAML);

        // if (!userInfoYAMLObject.性別) throw new Error("性別必須填寫");
        // if (!Object.values(GenderView).includes(userInfoYAMLObject.性別)) throw new Error("性別必須是為");

        // console.log(userInfoYAMLObject);
    };
}
