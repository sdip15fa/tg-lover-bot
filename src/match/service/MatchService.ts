import {Knex} from "knex";
import {db} from "../../common/db";
import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../../user/service/UserService";
import {FilterGender} from "../../common/enum/FilterGender";
import {Gender} from "../../common/enum/Gender";
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
        const notPermittedIds = await MatchService.notPermittedIds();

        const targetIds = await MatchService.matchRepository
            .pluck("target_id")
            .where({user_id: userId, like: true})
            .andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"))
            .andWhere("target_id", "NOT IN", notPermittedIds)
            .orderBy("created_at", "desc")
            .limit(5);

        const users = await this.userService.list(targetIds);

        return targetIds.map(id => users.find(u => u.telegramId === id));
    }

    async recentLikedMe(userId: string): Promise<UserView[]> {
        const notPermittedIds = await MatchService.notPermittedIds();
        const bidirectionalMatchedIds = await MatchService.bidirectionalMatchedIds(userId);

        const likedMeIds = await MatchService.matchRepository
            .pluck("user_id")
            .where({target_id: userId, like: true})
            .andWhere("created_at", ">", db.raw("'now'::timestamp - '1 month'::interval"))
            .andWhere("user_id", "NOT IN", [...notPermittedIds, ...bidirectionalMatchedIds])
            .orderBy("created_at", "desc")
            .limit(5);

        const users = await this.userService.list(likedMeIds);

        return likedMeIds.map(id => users.find(u => u.telegramId === id));
    }

    async bidirectionalMatchedUsers(userId: string): Promise<UserView[]> {
        const notPermittedIds = await MatchService.notPermittedIds();
        const targetIds = await MatchService.matchRepository.pluck("target_id").from("matches").where({user_id: userId, like: true});

        const userIds = await MatchService.matchRepository
            .pluck("user_id")
            .from("matches")
            .where({target_id: userId, like: true})
            .andWhere("user_id", "IN", targetIds)
            .andWhere("user_id", "NOT IN", notPermittedIds)
            .orderBy("created_at", "desc")
            .limit(5);

        return this.userService.list(userIds);
    }

    async vote(userId: string, targetId: string, like: boolean): Promise<boolean> {
        const recentMatchIds = await MatchService.recentVotedIds(userId);
        const notPermittedIds = await MatchService.notPermittedIds();

        if (notPermittedIds.includes(targetId)) {
            return false;
        }

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

        const recentMatchedIds = await MatchService.recentVotedIds(userId);
        const bidirectionalMatchedIds = await MatchService.bidirectionalMatchedIds(userId);
        const notPermittedIds = await MatchService.notPermittedIds();

        const luckyPickQuery = MatchService.userRepository.select<User[]>();
        MatchService.filterGender(luckyPickQuery, currentUser.gender!, currentUser.filterGender!);

        if (currentUser.filterGoalRelationship) luckyPickQuery.andWhere("goal_relationship", currentUser.goalRelationship);
        luckyPickQuery.andWhereBetween("age", [currentUser.filterAgeLowerBound!, currentUser.filterAgeUpperBound!]);
        luckyPickQuery.andWhereBetween("height", [currentUser.filterHeightLowerBound!, currentUser.filterHeightUpperBound!]);
        luckyPickQuery.andWhere("telegram_id", "NOT IN", [userId, ...recentMatchedIds, ...bidirectionalMatchedIds, ...notPermittedIds]);
        luckyPickQuery.orderByRaw("RANDOM()");
        luckyPickQuery.limit(1);
        const pickedUser = await luckyPickQuery.first();

        if (!pickedUser) return null;
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

    private static async notPermittedIds(): Promise<string[]> {
        return MatchService.userRepository.pluck("telegram_id").where({blocked: true}).orWhere({username: null}).orWhere({registered: false});
    }

    private static async recentVotedIds(userId: string): Promise<string[]> {
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
