import {UserView} from "../../common/view/user/UserView";

export class UserFilterConverter {
    public static template(view: Partial<UserView>): string {
        const stringBuilder: string[] = [];
        stringBuilder.push(`性別: ${view.filterGender}`);
        stringBuilder.push(`年齡: ${view.filterAgeLowerBound}-${view.filterAgeUpperBound}`);
        stringBuilder.push(`身高: ${view.filterHeightLowerBound}-${view.filterHeightUpperBound}`);
        return stringBuilder.join("\n");
    }
}
