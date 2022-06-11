import {Singleton} from "typescript-ioc";
import {db} from "../../common/db";
import {User} from "../interface/User";
import {UserView} from "../../common/view/user/UserView";

@Singleton
export class UserService {
    async get(id: string): Promise<UserView | null> {
        const user: User = (await UserService.userRepository.select().where({telegram_id: id}))?.[0];

        if (!user) {
            return null;
        }

        return UserService.view(user);
    }

    async upsert(data: Partial<UserView>) {
        const user = await this.get(data.telegramId!);

        if (user) {
            await UserService.userRepository.update(UserService.model(data)).where({telegram_id: data.telegramId!});
        } else {
            await UserService.userRepository.insert(UserService.model(data));
        }
    }

    private static model(view: Partial<UserView>): User {
        return {
            telegram_id: view.telegramId!,
            agree_terms: view.agreeTerms!,
            info_updated: view.infoUpdated!,
            filter_updated: view.filterUpdated!,
            photo_uploaded: view.photoUploaded!,
            agree_username_permission: view.agreeUsernamePermission!,
            gender: view.gender!,
            age: view.age!,
            height: view.height!,
            goal_relationship: view.goalRelationship!,
            smoking: view.smoking!,
            occupation: view.occupation,
            salary: view.salary,
            education: view.education,
            self_intro: view.selfIntro === null ? null : view.selfIntro ? view.selfIntro.join("\n") : undefined,
            relationship_criteria: view.relationshipCriteria === null ? null : view.relationshipCriteria ? view.relationshipCriteria.join("\n") : undefined,
            filter_gender: view.filterGender!,
            filter_age_lower_bound: view.filterAgeLowerBound!,
            filter_age_upper_bound: view.filterAgeUpperBound!,
            filter_height_lower_bound: view.filterHeightLowerBound!,
            filter_height_upper_bound: view.filterHeightUpperBound!,
            created_at: view.createdAt!,
            updated_at: view.updatedAt!,
        };
    }

    private static get userRepository() {
        return db.table("users");
    }

    private static view(user: User): UserView {
        const view = new UserView();
        view.telegramId = user.telegram_id;
        view.agreeTerms = user.agree_terms;
        view.infoUpdated = user.info_updated;
        view.filterUpdated = user.filter_updated;
        view.photoUploaded = user.photo_uploaded;
        view.agreeUsernamePermission = user.agree_username_permission;
        view.gender = user.gender;
        view.age = user.age;
        view.height = user.height;
        view.goalRelationship = user.goal_relationship;
        view.smoking = user.smoking;
        view.occupation = user.occupation;
        view.salary = user.salary;
        view.education = user.education;
        view.selfIntro = typeof user.self_intro === "string" ? user.self_intro.split(/\n/g) : user.self_intro;
        view.relationshipCriteria = typeof user.relationship_criteria === "string" ? user.relationship_criteria.split(/\n/g) : user.relationship_criteria;
        view.filterGender = user.filter_gender;
        view.filterAgeLowerBound = user.filter_age_lower_bound;
        view.filterAgeUpperBound = user.filter_age_upper_bound;
        view.filterHeightLowerBound = user.filter_height_lower_bound;
        view.filterHeightUpperBound = user.filter_height_upper_bound;
        view.createdAt = user.created_at;
        view.updatedAt = user.updated_at;
        return view;
    }
}
