import {Inject, Singleton} from "typescript-ioc";
import {StatsService} from "./StatsService";

@Singleton
export class StatsController {
    constructor(
        @Inject
        private statsService: StatsService
    ) {}

    stats = async ctx => {
        const genderStats = await this.statsService.genderStats();
        await ctx.replyWithHTML(`<b>目前已註冊會員</b>\n${genderStats.map(stat => `${stat.gender}會員：${stat.count}人`).join("\n")}`);
    };
}
