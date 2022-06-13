import {UserView} from "../../common/view/user/UserView";
import {User} from "../interface/User";
import {AmountUtil} from "../../common/util/AmountUtil";

export class UserConverter {
    public static model(view: Partial<UserView>): User {
        return {
            telegram_id: view.telegramId!,
            name: view.name!,
            username: view.username!,
            agree_terms: view.agreeTerms!,
            info_updated: view.infoUpdated!,
            filter_updated: view.filterUpdated!,
            photo_uploaded: view.photoUploaded!,
            registered: view.registered!,
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

    public static view(user: User): UserView {
        const view = new UserView();
        view.telegramId = user.telegram_id;
        view.name = user.name;
        view.username = user.username;
        view.agreeTerms = user.agree_terms;
        view.infoUpdated = user.info_updated;
        view.filterUpdated = user.filter_updated;
        view.photoUploaded = user.photo_uploaded;
        view.registered = user.registered;
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

    public static template(view: Partial<UserView>): string {
        const stringBuilder: string[] = [];
        stringBuilder.push(`暱稱: ${view.name}`);
        stringBuilder.push(`性別: ${view.gender}`);
        stringBuilder.push(`年齡: ${view.age}`);
        stringBuilder.push(`身高: ${view.height}cm`);
        stringBuilder.push(`尋找對象關係: ${view.goalRelationship}`);
        stringBuilder.push(`是否吸煙: ${view.smoking}`);

        if (view.occupation) stringBuilder.push(`職業: ${view.occupation}`);
        if (view.salary) stringBuilder.push(`月入: ${AmountUtil.format(view.salary)}HKD`);
        if (view.education) stringBuilder.push(`學歷: ${view.education}`);

        if (view.selfIntro) stringBuilder.push(`\n自我介紹:\n${view.selfIntro.map(s => `- ${s}`).join("\n")}`);
        if (view.relationshipCriteria) stringBuilder.push(`\n尋找對象:\n${view.relationshipCriteria.map(s => `- ${s}`).join("\n")}`);

        return stringBuilder.join("\n");
    }
}
