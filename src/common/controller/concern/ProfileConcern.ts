import {Inject, Singleton} from "typescript-ioc";
import {InputMediaPhoto} from "telegraf/types";
import {UserConverter} from "../../../user/service/UserConverter";
import {UserService} from "../../../user/service/UserService";
import {UserView} from "../../view/user/UserView";
import {UserPhotoService} from "../../../user/service/UserPhotoService";

@Singleton
export class ProfileConcern {
    constructor(
        @Inject
        private userService: UserService,
        @Inject
        private userPhotoService: UserPhotoService
    ) {}

    sendProfile = async (ctx: any, user: UserView, targetId: string, extra?: any) => {
        const template = UserConverter.template(user);
        const photoURLs = await this.userPhotoService.getPhotoURLs(user.telegramId);
        await this.sendProfilePhotos(ctx, photoURLs, targetId);
        await ctx.telegram.sendMessage(targetId, template, extra);
    };

    sendProfilePhotos = async (ctx: any, urls: string[], targetId: string) => {
        if (urls.length > 0) {
            await ctx.telegram.sendMediaGroup(targetId, urls.map(url => ({type: "photo", media: url})) as InputMediaPhoto[]);
        }
    };
}
