import omit from "lodash/omit";
import {Markup} from "telegraf";
import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../service/UserService";
import {UserInfoMessage} from "../constant/UserInfoMessage";
import {UserPhotoService} from "../service/UserPhotoService";
import {RegisterConcern} from "../../common/controller/concern/RegisterConcern";
import {WebFormConcern} from "../../common/controller/concern/WebFormConcern";
import {ProfileConcern} from "../../common/controller/concern/ProfileConcern";

@Singleton
export class UserInfoController {
    constructor(
        @Inject
        private readonly userService: UserService,
        @Inject
        private readonly userPhotoService: UserPhotoService,
        @Inject
        private readonly registerConcern: RegisterConcern,
        @Inject
        private readonly webFormConcern: WebFormConcern,
        @Inject
        private readonly profileConcern: ProfileConcern
    ) {}

    askForUserInfo = async ctx => {
        try {
            if (!(await this.auth(ctx))) return;

            const encodedUserData = this.webFormConcern.encodeData(await this.userData(ctx));

            await ctx.reply(UserInfoMessage.ASK_FOR_UPDATE_USER_INFO, Markup.keyboard([this.WEB_FORM_BUTTON(encodedUserData)]).resize());
        } catch (e) {
            console.log(e);
        }
    };

    updateUserInfo = async ctx => {
        try {
            if (!(await this.auth(ctx))) return;

            await this.userService.updateUserData(ctx.from.id, this.webFormConcern.parsedUserData(ctx));
            await ctx.reply(UserInfoMessage.USER_INFO_UPDATED, Markup.removeKeyboard());
            await this.myInfo(ctx);
        } catch (e) {
            console.log(e);
            return;
        }
    };

    myInfo = async ctx => {
        try {
            if (!(await this.auth(ctx))) return;

            const user = await this.userService.get(ctx.from.id);
            await this.profileConcern.sendProfile(ctx, user!, ctx.from.id);
        } catch (e) {
            console.log(e);
        }
    };

    renewUsername = async ctx => {
        if (!(await this.auth(ctx))) return;

        await ctx.reply(UserInfoMessage.USERNAME_RENEWED.replace("{username}", ctx.from.username));
    };

    private async auth(ctx) {
        if (!(await this.registerConcern.registerCheck(ctx))) return false;
        if (ctx.from.username) await this.userService.renewUsername(ctx);
        return true;
    }

    private WEB_FORM_BUTTON = (encodedData: any) => {
        return Markup.button.webApp(UserInfoMessage.UPDATE_USER_INFO, this.webFormConcern.webFormURL(process.env.USER_INFO_FORM!, encodedData));
    };

    private userData = async ctx => {
        const user = await this.userService.get(ctx.from.id);
        return omit(user, ["filterGender", "filterAgeLowerBound", "filterAgeUpperBound", "filterHeightLowerBound", "filterHeightUpperBound"]);
    };
}
