import {Inject, Singleton} from "typescript-ioc";
import {MatchService} from "./service/MatchService";
import {RegisterService} from "../register/RegisterService";
import {MatchMessage} from "./constant/MatchMessage";
import {UserPhotoService} from "../user/service/UserPhotoService";
import {UserConverter} from "../user/service/UserConverter";
import {InputMediaPhoto} from "telegraf/types";
import {Markup} from "telegraf";
import {MatchAction} from "./constant/MatchAction";
import {UserService} from "../user/service/UserService";
import {UserView} from "../common/view/user/UserView";

@Singleton
export class MatchController {
    constructor(
        @Inject
        private matchService: MatchService,
        @Inject
        private registerService: RegisterService,
        @Inject
        private userService: UserService,
        @Inject
        private userPhotoService: UserPhotoService
    ) {}

    registerCheck = async ctx => {
        const isRegistered = await this.registerService.isRegistered(ctx.from.id);

        if (!isRegistered) {
            await ctx.replyWithHTML(MatchMessage.MUST_REGISTER_BEFORE_USE);
            return;
        }
    };

    like = async ctx => {
        try {
            const targetId = `${ctx.match.input}`.replace(`${MatchAction.MATCH_LIKE}#`, "");
            const me = await this.userService.get(ctx.from.id);
            const target = await this.userService.get(targetId);
            const matched = await this.matchService.vote(ctx.from.id, targetId, true);

            if (matched && target && me) {
                await ctx.reply(MatchMessage.MATCHED.replace("{target_name}", `<b>${target.name!}</b>`).replace("{target_username}", target.username!), {parse_mode: "HTML"});
                await this.notifyMatchTarget(ctx, targetId);
            }
        } catch (e) {
            console.log(e);
        }

        await this.match(ctx);
    };

    dislike = async ctx => {
        try {
            const targetId = `${ctx.match.input}`.replace(`${MatchAction.MATCH_DISLIKE}#`, "");
            await this.matchService.vote(ctx.from.id, targetId, false);
        } catch (e) {
            console.log(e);
        }

        await this.match(ctx);
    };

    match = async ctx => {
        try {
            await this.registerCheck(ctx);
            const user = await this.matchService.luckyPick(ctx.from.id);

            if (!user) {
                await ctx.replyWithHTML(MatchMessage.NO_MATCH);
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

            await ctx.reply(
                template,
                Markup.inlineKeyboard([
                    Markup.button.callback(MatchMessage.LIKE, `${MatchAction.MATCH_LIKE}#${user.telegramId}`),
                    Markup.button.callback(MatchMessage.DISLIKE, `${MatchAction.MATCH_DISLIKE}#${user.telegramId}`),
                ])
            );
        } catch (e) {
            console.log(e);
        }
    };

    private notifyMatchTarget = async (ctx, targetId: string) => {
        const me = await this.userService.get(ctx.from.id);

        if (!me) {
            return;
        }

        await ctx.telegram.sendMessage(
            targetId,
            `${MatchMessage.MATCHED.replace("{target_name}", `<b>${me.name!}</b>`).replace("{target_username}", me.username!)}\n\n${MatchMessage.MATCHED_PERSON_AS_BElOW}`,
            {
                parse_mode: "HTML",
            }
        );

        const photoURLs = await this.userPhotoService.getPhotoURLs(me.telegramId);
        const template = UserConverter.template(me);

        if (photoURLs.length > 0) {
            await ctx.telegram.sendMediaGroup(
                targetId,
                photoURLs.map(url => ({
                    type: "photo",
                    media: url,
                })) as InputMediaPhoto[]
            );
        }

        await ctx.telegram.sendMessage(targetId, template);
    };

    recentLikedUsers = async ctx => {
        try {
            await this.registerCheck(ctx);
            const users = await this.matchService.recentLikedUsers(ctx.from.id);

            if (users.length === 0) {
                await ctx.replyWithHTML(MatchMessage.NO_RECENT_LIKED_USERS);
                return;
            }

            await ctx.reply(MatchMessage.RECENT_LIKED_PERSON_AS_BElOW.replace("{x}", users.length.toString()));
            await this.replyWithUsers(ctx, users);
        } catch (e) {
            console.log(e);
        }
    };

    recentMatchedUsers = async ctx => {
        try {
            await this.registerCheck(ctx);
            const users = await this.matchService.bidirectionalMatchedUsers(ctx.from.id);

            if (users.length === 0) {
                await ctx.replyWithHTML(MatchMessage.NO_RECENT_MATCHED_USERS);
                return;
            }

            await ctx.reply(MatchMessage.RECENT_MATCHED_PERSON_AS_BElOW.replace("{x}", users.length.toString()));
            await this.replyWithUsers(ctx, users, true);
        } catch (e) {
            console.log(e);
        }
    };

    private replyWithUsers = async (ctx, users: UserView[], showMatchedMessage?: boolean) => {
        const userPhotos = await this.userPhotoService.batchFetchPhotoURLs(users.map(user => user.telegramId));

        for (const user of users) {
            const photoURLs = userPhotos.filter(userPhoto => userPhoto.telegram_id === user.telegramId).map(userPhoto => userPhoto.photo_url);

            if (photoURLs.length > 0) {
                await ctx.replyWithMediaGroup(
                    photoURLs.map(url => ({
                        type: "photo",
                        media: url,
                    })) as InputMediaPhoto[]
                );
            }

            await ctx.reply(UserConverter.template(user));

            if (showMatchedMessage) {
                await ctx.reply(MatchMessage.MATCHED.replace("{target_name}", `<b>${user.name!}</b>`).replace("{target_username}", user.username!), {parse_mode: "HTML"});
            }
        }
    };
}
