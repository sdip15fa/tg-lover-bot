import {validate} from "class-validator";
import {Singleton} from "typescript-ioc";
import yaml from "yaml";
import {UserView} from "../../common/view/user/UserView";

@Singleton
export class UserInfoParser {
    async parseYAML(id: string, userInfoYAML: string): Promise<UserView> {
        const userInfoYAMLObject = yaml.parse(userInfoYAML);
        const userView = new UserView();

        userView.telegramId = id;
        userView.gender = userInfoYAMLObject.性別 || null;
        userView.age = userInfoYAMLObject.年齡 || null;
        userView.height = userInfoYAMLObject.身高 || null;
        userView.goalRelationship = userInfoYAMLObject.尋找對象關係 || null;
        userView.smoking = userInfoYAMLObject.是否吸煙 || null;
        userView.occupation = userInfoYAMLObject.職業 || null;
        userView.salary = userInfoYAMLObject.月入 || null;
        userView.education = userInfoYAMLObject.學歷 || null;
        userView.selfIntro = (userInfoYAMLObject.自我介紹 || []).map(String);
        userView.relationshipCriteria = (userInfoYAMLObject.尋找對象 || []).map(String);

        const validationErrors = await validate(userView);

        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        return userView;
    }
}
