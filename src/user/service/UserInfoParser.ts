import {validate} from "class-validator";
import {Singleton} from "typescript-ioc";
import yaml from "yaml";
import {UserInfoView} from "../view/UserInfoView";

@Singleton
export class UserInfoParser {
    async parseYAML(userInfoYAML: string): Promise<UserInfoView> {
        const userInfoYAMLObject = yaml.parse(userInfoYAML);

        const userInfoView = new UserInfoView();

        userInfoView.gender = userInfoYAMLObject.性別 || null;
        userInfoView.age = userInfoYAMLObject.年齡 || null;
        userInfoView.height = userInfoYAMLObject.身高 || null;
        userInfoView.goalRelationship = userInfoYAMLObject.尋找對象關係 || null;
        userInfoView.smoking = userInfoYAMLObject.吸煙 || null;
        userInfoView.occupation = userInfoYAMLObject.職業 || null;
        userInfoView.salary = userInfoYAMLObject.收入 || null;
        userInfoView.education = userInfoYAMLObject.學歷 || null;
        userInfoView.selfIntro = (userInfoYAMLObject.自我介紹 || []).map(String);
        userInfoView.relationshipCriteria = (userInfoYAMLObject.尋找對象 || []).map(String);

        const validationErrors = await validate(userInfoView);

        if (validationErrors.length > 0) {
            throw validationErrors;
        }

        return userInfoView;
    }
}
