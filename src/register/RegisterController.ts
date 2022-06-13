import {ValidationError} from "class-validator";
import {Markup} from "telegraf";
import {Inject, Singleton} from "typescript-ioc";
import {UserInfoParser} from "../user/service/UserInfoParser";
import {RegisterAction} from "./constant/RegisterAction";
import {RegisterMessage} from "./constant/RegisterMessage";
import {RegisterService} from "./RegisterService";
import {LocalizePropertyUtil} from "../common/core/validation/LocalizePropertyUtil";
import {InputMediaPhoto} from "telegraf/types";
import {UserFilterParser} from "../user/service/UserFilterParser";

@Singleton
export class RegisterController {
    constructor(
        @Inject
        private registerService: RegisterService,
        @Inject
        private userInfoParser: UserInfoParser,
        @Inject
        private userFilterParser: UserFilterParser
    ) {}

    enterScene = async ctx => {
        try {
            const isRegistered = await this.registerService.isRegistered(ctx.from.id);

            if (isRegistered) {
                await ctx.replyWithHTML(RegisterMessage.REGISTER_FINISHED);
                await ctx.scene.leave();
                return;
            }

            const agreedTerms = await this.registerService.isAgreeTerms(ctx.from.id);

            if (agreedTerms) {
                await this.askForUsernamePermission(ctx);
                return;
            }

            await ctx.reply(RegisterMessage.TERMS, {
                ...Markup.inlineKeyboard([
                    Markup.button.callback(RegisterMessage.AGREE_TERMS, RegisterAction.AGREE_TERMS),
                    Markup.button.callback(RegisterMessage.DISAGREE_TERMS, RegisterAction.DISAGREE_TERMS),
                ]),
                parse_mode: "HTML",
            });
        } catch (e) {
            console.log(e);
        }
    };

    askForUsernamePermission = async ctx => {
        try {
            const agreedUsernamePermission = await this.registerService.isAgreeUsernamePermission(ctx.from.id);

            if (agreedUsernamePermission) {
                await this.askForUserInfo(ctx);
                return;
            }

            const username = ctx.from.username;

            await ctx.reply(
                RegisterMessage.USERNAME_PERMISSION_CONFIRM(username),
                Markup.inlineKeyboard([
                    Markup.button.callback(RegisterMessage.AGREE, RegisterAction.AGREE_USERNAME_PERMISSION),
                    Markup.button.callback(RegisterMessage.DISAGREE, RegisterAction.DISAGREE_USERNAME_PERMISSION),
                ])
            );
        } catch (e) {
            console.log(e);
        }
    };

    askForUserInfo = async ctx => {
        try {
            const isInfoUpdated = await this.registerService.isInfoUpdated(ctx.from.id);
            if (isInfoUpdated) {
                await this.askForUploadPhotos(ctx);
                return;
            }

            await ctx.replyWithMarkdownV2(RegisterMessage.USER_INFO_SCHEMA);
            await ctx.reply(RegisterMessage.USER_INFO_SAMPLE, {
                reply_markup: {force_reply: true, input_field_placeholder: RegisterMessage.YOUR_USER_INFO},
            });
        } catch (e) {
            console.log(e);
        }
    };

    askForUploadPhotos = async ctx => {
        try {
            const isPhotoUploaded = await this.registerService.isPhotoUploaded(ctx.from.id);
            if (isPhotoUploaded) {
                await this.askForFilter(ctx);
                return;
            }

            await ctx.reply(RegisterMessage.ASK_FOR_PHOTOS, Markup.inlineKeyboard([Markup.button.callback(RegisterMessage.SKIP_THIS_STEP, RegisterAction.UPDATE_FILTER)]));
        } catch (e) {
            console.log(e);
        }
    };

    askForFilter = async ctx => {
        try {
            const isFilterUpdated = await this.registerService.isFilterUpdated(ctx.from.id);
            if (isFilterUpdated) {
                await this.registerFinished(ctx);
                return;
            }

            await this.registerService.markPhotoUploaded(ctx.from.id);
            await ctx.replyWithMarkdownV2(RegisterMessage.FILTER_SCHEMA);

            await ctx.reply(RegisterMessage.FILTER_SAMPLE, {
                reply_markup: {force_reply: true, input_field_placeholder: RegisterMessage.YOUR_FILTER},
            });
        } catch (e) {
            console.log(e);
        }
    };

    agreeTerms = async ctx => {
        try {
            await this.registerService.agreeTerms(ctx.from.id);
        } catch (e) {
            console.log(e);
        }

        await this.askForUsernamePermission(ctx);
    };

    disagreeTerms = async ctx => {
        try {
            await this.registerService.disagreeTerms(ctx.from.id);
            await ctx.reply(RegisterMessage.DISAGREE_TERMS_ERROR);
        } catch (e) {
            console.log(e);
        }
        await ctx.scene.leave();
    };

    agreeUsernamePermission = async ctx => {
        try {
            await this.registerService.agreeUsernamePermission(ctx.from.id, ctx.from.username);
        } catch (e) {
            console.log(e);
        }
        await this.askForUserInfo(ctx);
    };

    disagreeUsernamePermission = async ctx => {
        try {
            await this.registerService.disagreeUsernamePermission(ctx.from.id);
            await ctx.reply(RegisterMessage.DISAGREE_USERNAME_PERMISSION_ERROR);
        } catch (e) {
            console.log(e);
        }
        await ctx.scene.leave();
    };

    createUserInfo = async ctx => {
        try {
            const userInfoYAML = ctx.match.input;
            const userView = await this.userInfoParser.parseYAML(ctx.from.id, userInfoYAML);

            await this.registerService.updateUserInfo(userView);

            await ctx.reply(RegisterMessage.USER_INFO_UPDATED);
        } catch (e) {
            console.log(e);
            if (Array.isArray(e) && e[0] instanceof ValidationError) {
                const validationErrors: ValidationError[] = e;

                await ctx.replyWithHTML(
                    `<b>${RegisterMessage.USER_INFO_VALIDATION_ERROR}</b>\n${validationErrors
                        .map(v => `<b>${LocalizePropertyUtil.getPropertyName(v.property)}:</b>\n${(v.constraints ? Object.values(v.constraints) : []).map(_ => `- ${_}`).join("\n")}`)
                        .join("\n")}`
                );
            } else {
                await ctx.reply(RegisterMessage.USER_INFO_FORMAT_ERROR);
            }
            return;
        }

        await this.askForUploadPhotos(ctx);
    };

    updateFilter = async ctx => {
        try {
            const userInfoYAML = ctx.match.input;
            const userFilterView = await this.userFilterParser.parseYAML(ctx.from.id, userInfoYAML);

            await this.registerService.updateFilter(ctx.from.id, userFilterView);

            await ctx.reply(RegisterMessage.USER_FILTER_UPDATED);
        } catch (e) {
            console.log(e);

            if (Array.isArray(e) && typeof e[0] === "string") {
                await ctx.replyWithHTML(`<b>${RegisterMessage.USER_INFO_VALIDATION_ERROR}</b>\n${e.map(v => `- ${v}`).join("\n")}`);
            } else {
                await ctx.replyWithHTML(`<b>${RegisterMessage.USER_INFO_VALIDATION_ERROR}</b>`);
            }
        }

        await this.registerFinished(ctx);
    };

    registerFinished = async ctx => {
        try {
            await this.registerService.markRegistered(ctx.from.id);
            await ctx.replyWithHTML(RegisterMessage.REGISTER_FINISHED);
        } catch (e) {
            console.log(e);
        }
        await ctx.scene.leave();
    };

    uploadPhotos = async ctx => {
        try {
            const isInfoUpdated = await this.registerService.isInfoUpdated(ctx.from.id);

            if (!isInfoUpdated) return;

            const message = await ctx.reply("上傳照片中...");
            await ctx.replyWithChatAction("upload_photo");

            const uploadedPhotoURL = await this.registerService.uploadPhoto(ctx.from.id, ctx.message.photo[ctx.message.photo.length - 1]);

            await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, undefined, "上傳照片完成，正在處理中...");
            const photoURLs = await this.registerService.addPhoto(ctx.from.id, uploadedPhotoURL);

            if (photoURLs !== null) {
                const photoCount = photoURLs.length;

                await ctx.replyWithMediaGroup(
                    photoURLs.map(url => ({
                        type: "photo",
                        media: url,
                    })) as InputMediaPhoto[]
                );
                await ctx.reply(
                    RegisterMessage.USER_PHOTOS_UPDATED.replace("{x}", photoCount.toString()),
                    Markup.inlineKeyboard([Markup.button.callback(RegisterMessage.NEXT_STEP, RegisterAction.UPDATE_FILTER)])
                );
                await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
            }
        } catch (e: any) {
            ctx.reply(e.message + "\n\n" + RegisterMessage.GOTO_NEXT_STEP_IF_UPLOAD_FINISHED, Markup.inlineKeyboard([Markup.button.callback(RegisterMessage.NEXT_STEP, RegisterAction.UPDATE_FILTER)]));
        }
    };

    clearPhotos = async ctx => {
        try {
            await this.registerService.clearPhotos(ctx.from.id);
            await ctx.reply(RegisterMessage.USER_PHOTOS_CLEARED);
        } catch (e) {
            console.log(e);
        }
        await this.askForUploadPhotos(ctx);
    };
}
