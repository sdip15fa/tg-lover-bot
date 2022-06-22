import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../service/UserService";
import {UserFilterMessage} from "../constant/UserFilterMessage";
import {RegisterConcern} from "../../common/controller/concern/RegisterConcern";
import {WebFormConcern} from "./concern/WebFormConcern";
import {UserFilterConverter} from "../service/UserFilterConverter";
import {Markup} from "telegraf";
import pick from "lodash/pick";

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
            await this.registerConcern.registerCheck(ctx);
            const encodedUserData = this.webFormConcern.encodeData(await this.filterData(ctx));
            await ctx.replyWithMarkdownV2(UserFilterMessage.ASK_FOR_FILER, Markup.keyboard([this.WEB_FORM_BUTTON(encodedUserData)]).resize());
        } catch (e) {
            console.log(e);
        }
    };

    updateFilter = async ctx => {
        try {
            await this.registerConcern.registerCheck(ctx);
            await this.userService.updateUserData(ctx.from.id, this.webFormConcern.parsedUserData(ctx));
            await ctx.reply(UserFilterMessage.USER_FILTER_UPDATED, Markup.removeKeyboard());
            await this.myFilter(ctx);
        } catch (e) {
            console.log(e);
        }
    };

    myFilter = async ctx => {
        try {
            await this.registerConcern.registerCheck(ctx);
            const user = await this.userService.get(ctx.from.id);
            const template = UserFilterConverter.template(user!);
            await ctx.reply(template);
        } catch (e) {
            console.log(e);
        }
    };

    private WEB_FORM_BUTTON = (encodedData: any) => {
        return Markup.button.webApp(UserFilterMessage.UPDATE_FILTER, this.webFormConcern.webFormURL(process.env.USER_FILTER_FORM!, encodedData));
    };

    private filterData = async ctx => {
        const user = await this.userService.get(ctx.from.id);
        return pick(user, ["filterGender", "filterAgeLowerBound", "filterAgeUpperBound", "filterHeightLowerBound", "filterHeightUpperBound"]);
    };
}
