import {Inject, Singleton} from "typescript-ioc";
import {RegisterConcern} from "../../common/controller/concern/RegisterConcern";
import {InputMediaPhoto} from "telegraf/types";
import {UserService} from "../service/UserService";
import {UserPhotoService} from "../service/UserPhotoService";
import {UserPhotoMessage} from "../constant/UserPhotoMessage";

@Singleton
export class UserPhotoController {
    constructor(
        @Inject
        private readonly registerConcern: RegisterConcern,
        @Inject
        private readonly userService: UserService,
        @Inject
        private readonly userPhotoService: UserPhotoService
    ) {}

    askForUploadPhotos = async ctx => {
        try {
            if (!(await this.registerConcern.registerCheck(ctx))) return;
            await ctx.reply(UserPhotoMessage.ASK_FOR_PHOTOS);
        } catch (e) {
            console.log(e);
        }
    };

    uploadPhotos = async ctx => {
        try {
            const message = await ctx.reply(UserPhotoMessage.UPLOADING_PHOTOS);
            await ctx.replyWithChatAction("upload_photo");

            const uploadedPhotoURL = await this.userService.uploadPhoto(ctx.from.id, ctx.message.photo[ctx.message.photo.length - 1]);

            await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, undefined, UserPhotoMessage.PROCESSING_PHOTOS);
            const photoURLs = await this.userService.addPhoto(ctx.from.id, uploadedPhotoURL);

            if (photoURLs !== null) {
                const photoCount = photoURLs.length;
                await ctx.replyWithMediaGroup(photoURLs.map(url => ({type: "photo", media: url})) as InputMediaPhoto[]);
                await ctx.reply(UserPhotoMessage.USER_PHOTOS_UPDATED.replace("{x}", photoCount.toString()));
                await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
            }
        } catch (e: any) {
            ctx.reply(e.message);
        }
    };

    clearPhotos = async ctx => {
        try {
            await this.userPhotoService.clearPhotos(ctx.from.id);
            await ctx.reply(UserPhotoMessage.USER_PHOTOS_CLEARED);
        } catch (e) {
            console.log(e);
        }
    };
}
