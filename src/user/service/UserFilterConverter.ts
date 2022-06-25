import {UserView} from "../../common/view/user/UserView";

export class UserFilterConverter {
    public static template(view: Partial<UserView>): string {
        const stringBuilder: string[] = [];
        stringBuilder.push(`性別: ${view.filterGender}`);
        stringBuilder.push(`年齡: ${view.filterAgeLowerBound}-${view.filterAgeUpperBound}`);
        stringBuilder.push(`身高: ${view.filterHeightLowerBound}-${view.filterHeightUpperBound}`);
        if (view.filterGoalRelationship) stringBuilder.push(`尋找對象關係: ${view.goalRelationship}`);
        return stringBuilder.join("\n");
    }
}
