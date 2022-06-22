import {Inject, Singleton} from "typescript-ioc";
import {db} from "../../common/db";
import {UserService} from "../../user/service/UserService";
import {FilterGender} from "../../common/enum/FilterGender";
import {Gender} from "../../common/enum/Gender";
import {Knex} from "knex";
import {User} from "../../user/interface/User";
import {UserConverter} from "../../user/service/UserConverter";
import {UserView} from "../../common/view/user/UserView";
import first from "lodash/first";

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

    async bidirectionalMatchedUsers(userId: string): Promise<UserView[]> {
        const targetIds = await MatchService.matchRepository
            .pluck("target_id")
            .from("matches AS m1")
            .where({user_id: userId, like: true})
            .andWhere("target_id", "IN", MatchService.matchRepository.select("user_id").from("matches AS m2").where({target_id: userId, like: true}))
            .orderBy("created_at", "desc")
            .limit(5);

        return this.userService.list(targetIds);
    }

    async vote(userId: string, targetId: string, like: boolean): Promise<boolean> {
        const recentMatchIds = await MatchService.recentMatchedIds(userId);

        if (recentMatchIds.includes(targetId)) {
            await MatchService.matchRepository.update({like}).where({user_id: userId, target_id: targetId}).andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"));
        } else {
            await MatchService.matchRepository.insert({user_id: userId, target_id: targetId, like});
        }

        const bidirectionalMatchIds = await MatchService.bidirectionalMatchedIds(userId);

        return bidirectionalMatchIds.includes(targetId);
    }

    async luckyPick(userId: string): Promise<UserView | null> {
        const currentUser = await this.userService.get(userId);

        if (!currentUser) return null;

        const recentMatchedIds = await MatchService.recentMatchedIds(userId);
        const bidirectionalMatchedIds = await MatchService.bidirectionalMatchedIds(userId);

        const luckyPickQuery = MatchService.userRepository.select<User[]>();
        MatchService.filterGender(luckyPickQuery, currentUser.gender!, currentUser.filterGender!);
        luckyPickQuery.andWhere({registered: true});
        luckyPickQuery.andWhereBetween("age", [currentUser.filterAgeLowerBound!, currentUser.filterAgeUpperBound!]);
        luckyPickQuery.andWhereBetween("height", [currentUser.filterHeightLowerBound!, currentUser.filterHeightUpperBound!]);
        luckyPickQuery.andWhere("telegram_id", "NOT IN", [userId, ...recentMatchedIds, ...bidirectionalMatchedIds]);
        luckyPickQuery.orderByRaw("RANDOM()");
        luckyPickQuery.limit(1);

        const result = await luckyPickQuery;

        const pickedUser = first(result);

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

    private static async recentMatchedIds(userId: string): Promise<string[]> {
        return MatchService.matchRepository.pluck("target_id").where({user_id: userId}).andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"));
    }

    private static async bidirectionalMatchedIds(userId: string): Promise<string[]> {
        return MatchService.matchRepository
            .pluck("target_id")
            .distinct()
            .from("matches AS m1")
            .where({user_id: userId, like: true})
            .andWhere("target_id", "IN", MatchService.matchRepository.select("user_id").from("matches AS m2").where({target_id: userId, like: true}));
    }

    private static get userRepository() {
        return db.table("users");
    }

    private static get matchRepository() {
        return db.table("matches");
    }
}
