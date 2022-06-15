import {Inject, Singleton} from "typescript-ioc";
import {db} from "../../common/db";
import {UserService} from "../../user/service/UserService";
import {FilterGender} from "../../common/enum/FilterGender";
import {Gender} from "../../common/enum/Gender";
import {Knex} from "knex";
import {User} from "../../user/interface/User";
import {UserConverter} from "../../user/service/UserConverter";
import {UserView} from "../../common/view/user/UserView";

@Singleton
export class MatchService {
    constructor(
        @Inject
        private readonly userService: UserService
    ) {}

    async recentLikedUsers(userId: string): Promise<UserView[]> {
        const targetIds = await MatchService.matchRepository
            .pluck("target_id")
            .where({user_id: userId, like: true})
            .andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"))
            .orderBy("created_at", "desc")
            .limit(5);

        const users = await this.userService.list(targetIds);

        return targetIds.map(id => users.find(u => u.telegramId === id));
    }

    async recentMatchedIds(userId: string): Promise<string[]> {
        return MatchService.matchRepository.pluck("target_id").where({user_id: userId}).andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"));
    }

    async bidirectionalMatchedUsers(userId: string): Promise<UserView[]> {
        const result = await db.raw(
            `
                SELECT target_id
                FROM "matches" AS "m1"
                WHERE "user_id" = ?
                  AND "like" = true
                  AND target_id IN (SELECT user_id FROM matches m2 WHERE m2.target_id = m1.user_id AND m2.like = true)
                ORDER BY "created_at" DESC
                LIMIT 5
            `,
            [userId]
        );

        const targetIds = result.rows.map(({target_id}) => target_id);

        return this.userService.list(targetIds);
    }

    async bidirectionalMatchedIds(userId: string): Promise<string[]> {
        const result = await db.raw(
            `
                SELECT DISTINCT target_id
                FROM "matches" AS "m1"
                WHERE "user_id" = ?
                  AND "like" = true
                  AND target_id IN (SELECT user_id FROM matches m2 WHERE m2.target_id = m1.user_id AND m2.like = true)
            `,
            [userId]
        );

        return result.rows.map(({target_id}) => target_id);
    }

    async vote(userId: string, targetId: string, like: boolean): Promise<boolean> {
        const recentMatchIds = await this.recentMatchedIds(userId);

        if (recentMatchIds.includes(targetId)) {
            await MatchService.matchRepository.update({like}).where({user_id: userId, target_id: targetId}).andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"));
        } else {
            await MatchService.matchRepository.insert({user_id: userId, target_id: targetId, like});
        }

        const bidirectionalMatchIds = await this.bidirectionalMatchedIds(userId);

        return bidirectionalMatchIds.includes(targetId);
    }

    async luckyPick(userId: string): Promise<UserView | null> {
        const currentUser = await this.userService.get(userId);

        if (!currentUser) {
            return null;
        }

        const recentMatchIds = await this.recentMatchedIds(userId);
        const bidirectionalMatchIds = await this.bidirectionalMatchedIds(userId);

        const luckyPickQuery = MatchService.userRepository.select<User[]>();
        MatchService.filterGender(luckyPickQuery, currentUser.gender!, currentUser.filterGender!);
        luckyPickQuery.where({registered: true});
        luckyPickQuery.whereBetween("age", [currentUser.filterAgeLowerBound!, currentUser.filterAgeUpperBound!]);
        luckyPickQuery.whereBetween("height", [currentUser.filterHeightLowerBound!, currentUser.filterHeightUpperBound!]);
        luckyPickQuery.whereNotIn("telegram_id", [userId, ...recentMatchIds, ...bidirectionalMatchIds]);
        luckyPickQuery.orderByRaw("RANDOM()");
        luckyPickQuery.limit(1);

        const result = await luckyPickQuery;

        const pickedUser = result?.[0];

        if (!pickedUser) {
            return null;
        }

        return UserConverter.view(pickedUser);
    }

    private static filterGender(query: Knex.QueryBuilder, gender: Gender, filterGender: FilterGender): void {
        switch (filterGender) {
            case FilterGender.異性:
                query.where({gender: gender === Gender.男 ? Gender.女 : Gender.男});
                break;
            case FilterGender.同性:
                query.where({gender});
                break;
            default:
                break;
        }
    }

    private static get userRepository() {
        return db.table("users");
    }

    private static get matchRepository() {
        return db.table("matches");
    }
}
