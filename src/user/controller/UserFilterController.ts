import pick from "lodash/pick";
import {Markup} from "telegraf";
import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../service/UserService";
import {UserFilterMessage} from "../constant/UserFilterMessage";
import {RegisterConcern} from "../../common/controller/concern/RegisterConcern";
import {WebFormConcern} from "../../common/controller/concern/WebFormConcern";
import {UserFilterConverter} from "../service/UserFilterConverter";

@Singleton
export class UserFilterController {
    constructor(
        @Inject
        private readonly userService: UserService,
        @Inject
        private readonly registerConcern: RegisterConcern,
        @Inject
        private readonly webFormConcern: WebFormConcern
    ) {}

    askForFilter = async ctx => {
        try {
            if (!(await this.auth(ctx))) return;

            const encodedUserData = this.webFormConcern.encodeData(await this.filterData(ctx));
            await ctx.reply(UserFilterMessage.ASK_FOR_UPDATE_FILTER, Markup.keyboard([this.WEB_FORM_BUTTON(encodedUserData)]).resize());
        } catch (e) {
            console.log(e);
        }
    };

    updateFilter = async ctx => {
        try {
            if (!(await this.auth(ctx))) return;

            await this.userService.updateUserData(ctx.from.id, this.webFormConcern.parsedUserData(ctx));
            await ctx.reply(UserFilterMessage.USER_FILTER_UPDATED, Markup.removeKeyboard());
            await this.myFilter(ctx);
        } catch (e) {
            console.log(e);
            await ctx.telegram.sendMessage(process.env.ADMIN_ID, `User @${ctx.from.username} called updateFilter with an error:\n${JSON.stringify(e)}`);
        }
    };

    myFilter = async ctx => {
        try {
            if (!(await this.auth(ctx))) return;

            const user = await this.userService.get(ctx.from.id);
            const template = UserFilterConverter.template(user!);
            await ctx.reply(template);
        } catch (e) {
            console.log(e);
        }
    };

    private async auth(ctx) {
        if (!(await this.registerConcern.registerCheck(ctx))) return false;
        if (ctx.from.username) await this.userService.renewUsername(ctx);
        return true;
    }

    private WEB_FORM_BUTTON = encodedData => {
        return Markup.button.webApp(UserFilterMessage.UPDATE_FILTER, this.webFormConcern.webFormURL(process.env.USER_FILTER_FORM!, encodedData));
    };

    private filterData = async ctx => {
        const user = await this.userService.get(ctx.from.id);
        return pick(user, ["filterGender", "filterAgeLowerBound", "filterAgeUpperBound", "filterHeightLowerBound", "filterHeightUpperBound", "filterGoalRelationship", "goalRelationship"]);
    };
}
