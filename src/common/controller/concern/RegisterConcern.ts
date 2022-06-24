import {Inject, Singleton} from "typescript-ioc";
import {RegisterService} from "../../../register/RegisterService";
import {CommonMessage} from "../../constant/CommonMessage";

@Singleton
export class RegisterConcern {
    constructor(
        @Inject
        private readonly registerService: RegisterService
    ) {}

    registerCheck = async ctx => {
        const isRegistered = await this.registerService.isRegistered(ctx.from.id);

        if (!isRegistered) {
            await ctx.replyWithHTML(CommonMessage.MUST_REGISTER_BEFORE_USE);
            return false;
        }

        return true;
    };
}
