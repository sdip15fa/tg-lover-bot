import {Markup} from "telegraf";
import {Inject, Singleton} from "typescript-ioc";
import {RegisterAction} from "./constant/RegisterAction";
import {RegisterMessage} from "./constant/RegisterMessage";
import {RegisterService} from "./RegisterService";
import {InputMediaPhoto} from "telegraf/types";
import {WebFormConcern} from "../common/controller/concern/WebFormConcern";
import {UserInfoMessage} from "../user/constant/UserInfoMessage";
import {UserFilterMessage} from "../user/constant/UserFilterMessage";
import {UserService} from "../user/service/UserService";
import {ProfileConcern} from "../common/controller/concern/ProfileConcern";
import {UserFilterConverter} from "../user/service/UserFilterConverter";
import {UserPhotoMessage} from "../user/constant/UserPhotoMessage";
import {UserPhotoService} from "../user/service/UserPhotoService";

@Singleton
export class RegisterController {
    constructor(
        @Inject
        private readonly registerService: RegisterService,
        @Inject
        private readonly userService: UserService,
        @Inject
        private readonly userPhotoService: UserPhotoService,
        @Inject
        private readonly webFormConcern: WebFormConcern,
        @Inject
        private readonly profileConcern: ProfileConcern
    ) {}

    enterScene = async ctx => {
        try {
            if (await this.registered(ctx)) {
                return;
            }

            const agreedTerms = await this.registerService.isAgreeTerms(ctx.from.id);

            if (agreedTerms) {
                await this.askForUsernamePermission(ctx);
                return;
            }

            await ctx.replyWithHTML(RegisterMessage.TERMS, this.AGREE_TERMS_BUTTONS);
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

            await ctx.reply(RegisterMessage.USERNAME_PERMISSION_CONFIRM(username), this.AGREE_USERNAME_PERMISSION_BUTTONS);
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

            await ctx.reply(UserInfoMessage.ASK_FOR_FILL_USER_INFO, Markup.keyboard([this.USER_INFO_FORM_BUTTON()]).resize());
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

            await ctx.reply(RegisterMessage.ASK_FOR_PHOTOS, this.ASK_FOR_PHOTOS_BUTTONS);
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

            await ctx.reply(UserFilterMessage.ASK_FOR_FILL_FILTER, Markup.keyboard([this.USER_FILTER_FORM_BUTTON()]).resize());
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

    updateUserInfo = async ctx => {
        try {
            await this.userService.updateUserData(ctx.from.id, {...this.webFormConcern.parsedUserData(ctx), infoUpdated: true});
            await ctx.reply(UserInfoMessage.USER_INFO_UPDATED, Markup.removeKeyboard());
            await this.myInfo(ctx);
        } catch (e) {
            console.log(e);
            return;
        }

        await this.askForUploadPhotos(ctx);
    };

    updateFilter = async ctx => {
        try {
            await this.userService.updateUserData(ctx.from.id, {...this.webFormConcern.parsedUserData(ctx), filterUpdated: true});
            await ctx.reply(UserFilterMessage.USER_FILTER_UPDATED, Markup.removeKeyboard());
            await this.myFilter(ctx);
        } catch (e) {
            console.log(e);
            return;
        }

        await this.registerFinished(ctx);
    };

    private registerFinished = async ctx => {
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

            const message = await ctx.reply(UserPhotoMessage.UPLOADING_PHOTOS);
            await ctx.replyWithChatAction("upload_photo");

            const uploadedPhotoURL = await this.userService.uploadPhoto(ctx.from.id, ctx.message.photo[ctx.message.photo.length - 1]);

            await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, undefined, UserPhotoMessage.PROCESSING_PHOTOS);
            const photoURLs = await this.userService.addPhoto(ctx.from.id, uploadedPhotoURL);

            if (photoURLs !== null) {
                const photoCount = photoURLs.length;
                await ctx.replyWithMediaGroup(photoURLs.map(url => ({type: "photo", media: url})) as InputMediaPhoto[]);
                await ctx.reply(
                    UserPhotoMessage.USER_PHOTOS_UPDATED.replace("{x}", photoCount.toString()),
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
            await this.userPhotoService.clearPhotos(ctx.from.id);
            await ctx.reply(UserPhotoMessage.USER_PHOTOS_CLEARED);
        } catch (e) {
            console.log(e);
        }
        await this.askForUploadPhotos(ctx);
    };

    private registered = async ctx => {
        const isRegistered = await this.registerService.isRegistered(ctx.from.id);

        if (isRegistered) {
            await ctx.replyWithHTML(RegisterMessage.REGISTER_FINISHED);
            ctx.scene.leave();
            return true;
        }

        return false;
    };

    private myInfo = async ctx => {
        try {
            const user = await this.userService.get(ctx.from.id);
            await this.profileConcern.sendProfile(ctx, user!, ctx.from.id);
        } catch (e) {
            console.log(e);
        }
    };

    private myFilter = async ctx => {
        try {
            const user = await this.userService.get(ctx.from.id);
            const template = UserFilterConverter.template(user!);
            await ctx.reply(template);
        } catch (e) {
            console.log(e);
        }
    };

    private AGREE_USERNAME_PERMISSION_BUTTONS = Markup.inlineKeyboard([
        Markup.button.callback(RegisterMessage.AGREE, RegisterAction.AGREE_USERNAME_PERMISSION),
        Markup.button.callback(RegisterMessage.DISAGREE, RegisterAction.DISAGREE_USERNAME_PERMISSION),
    ]);

    private AGREE_TERMS_BUTTONS = Markup.inlineKeyboard([
        Markup.button.callback(RegisterMessage.AGREE_TERMS, RegisterAction.AGREE_TERMS),
        Markup.button.callback(RegisterMessage.DISAGREE_TERMS, RegisterAction.DISAGREE_TERMS),
    ]);

    private ASK_FOR_PHOTOS_BUTTONS = Markup.inlineKeyboard([Markup.button.callback(RegisterMessage.SKIP_THIS_STEP, RegisterAction.UPDATE_FILTER)]);

    private USER_INFO_FORM_BUTTON = () => {
        return Markup.button.webApp(UserInfoMessage.FILL_USER_INFO, this.webFormConcern.webFormURL(process.env.USER_INFO_FORM!));
    };

    private USER_FILTER_FORM_BUTTON = () => {
        return Markup.button.webApp(UserFilterMessage.FILL_FILTER, this.webFormConcern.webFormURL(process.env.USER_FILTER_FORM!));
    };
}
