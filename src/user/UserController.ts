import {Inject} from "typescript-ioc";
import {UserService} from "./service/UserService";
import {UserMessage} from "./constant/UserMessage";
import {InputMediaPhoto} from "telegraf/types";
import {UserPhotoService} from "./service/UserPhotoService";
import {UserConverter} from "./service/UserConverter";
import {UserFilterConverter} from "./service/UserFilterConverter";
import {RegisterService} from "../register/RegisterService";
import {Markup} from "telegraf";
import base64 from "base64-utf8";
import {omit, pick} from "lodash";

export class UserController {
    constructor(
        @Inject
        private readonly userService: UserService,
        @Inject
        private readonly registerService: RegisterService,
        @Inject
        private readonly userPhotoService: UserPhotoService
    ) {}

    registerCheck = async ctx => {
        const isRegistered = await this.registerService.isRegistered(ctx.from.id);

        if (!isRegistered) {
            await ctx.replyWithHTML(UserMessage.MUST_REGISTER_BEFORE_USE);
            return;
        }
    };

    askForUserInfo = async ctx => {
        try {
            await this.registerCheck(ctx);
            const user = await this.userService.get(ctx.from.id);
            const userData = omit(user, ["filterGender", "filterAgeLowerBound", "filterAgeUpperBound", "filterHeightLowerBound", "filterHeightUpperBound"]);

            await ctx.replyWithMarkdownV2(
                UserMessage.ASK_FOR_USER_INFO,
                Markup.keyboard([Markup.button.webApp(UserMessage.UPDATE_USER_INFO, `${process.env.USER_INFO_FORM}?userData=${base64.encode(JSON.stringify(userData))}`)]).resize()
            );
        } catch (e) {
            console.log(e);
        }
    };

    askForUploadPhotos = async ctx => {
        try {
            await this.registerCheck(ctx);
            await ctx.reply(UserMessage.ASK_FOR_PHOTOS);
        } catch (e) {
            console.log(e);
        }
    };

    askForFilter = async ctx => {
        try {
            await this.registerCheck(ctx);
            const user = await this.userService.get(ctx.from.id);
            const userData = pick(user, ["filterGender", "filterAgeLowerBound", "filterAgeUpperBound", "filterHeightLowerBound", "filterHeightUpperBound"]);

            await ctx.replyWithMarkdownV2(
                UserMessage.ASK_FOR_FILER,
                Markup.keyboard([Markup.button.webApp(UserMessage.UPDATE_FILTER, `${process.env.USER_FILTER_FORM}?userData=${base64.encode(JSON.stringify(userData))}`)]).resize()
            );
        } catch (e) {
            console.log(e);
        }
    };

    updateUserInfo = async ctx => {
        try {
            await this.registerCheck(ctx);
            await this.userService.upsert({
                telegramId: ctx.from.id,
                ...JSON.parse(ctx.update.message.web_app_data.data),
            });
            await ctx.reply(UserMessage.USER_INFO_UPDATED, Markup.removeKeyboard());
        } catch (e) {
            console.log(e);
            return;
        }
    };

    updateFilter = async ctx => {
        try {
            await this.registerCheck(ctx);
            await this.userService.upsert({
                telegramId: ctx.from.id,
                ...JSON.parse(ctx.update.message.web_app_data.data),
            });
            await ctx.reply(UserMessage.USER_FILTER_UPDATED, Markup.removeKeyboard());
        } catch (e) {
            console.log(e);
        }
    };

    uploadPhotos = async ctx => {
        try {
            const message = await ctx.reply("上傳照片中...");
            await ctx.replyWithChatAction("upload_photo");

            const uploadedPhotoURL = await this.userService.uploadPhoto(ctx.from.id, ctx.message.photo[ctx.message.photo.length - 1]);

            await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, undefined, "上傳照片完成，正在處理中...");
            const photoURLs = await this.userService.addPhoto(ctx.from.id, uploadedPhotoURL);

            if (photoURLs !== null) {
                const photoCount = photoURLs.length;

                await ctx.replyWithMediaGroup(
                    photoURLs.map(url => ({
                        type: "photo",
                        media: url,
                    })) as InputMediaPhoto[]
                );
                await ctx.reply(UserMessage.USER_PHOTOS_UPDATED.replace("{x}", photoCount.toString()));
                await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
            }
        } catch (e: any) {
            ctx.reply(e.message);
        }
    };

    myInfo = async ctx => {
        try {
            const user = await this.userService.get(ctx.from.id);
            if (!user) {
                return;
            }

            const photoURLs = await this.userPhotoService.getPhotoURLs(user.telegramId);
            const template = UserConverter.template(user);

            if (photoURLs.length > 0) {
                await ctx.replyWithMediaGroup(
                    photoURLs.map(url => ({
                        type: "photo",
                        media: url,
                    })) as InputMediaPhoto[]
                );
            }

            await ctx.reply(template);
        } catch (e) {
            console.log(e);
        }
    };

    myFilter = async ctx => {
        try {
            const user = await this.userService.get(ctx.from.id);
            if (!user) {
                return;
            }

            const template = UserFilterConverter.template(user);

            await ctx.reply(template);
        } catch (e) {
            console.log(e);
        }
    };

    clearPhotos = async ctx => {
        try {
            await this.userPhotoService.clearPhotos(ctx.from.id);
            await ctx.reply(UserMessage.USER_PHOTOS_CLEARED);
        } catch (e) {
            console.log(e);
        }
    };
}
