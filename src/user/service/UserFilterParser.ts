import {Singleton} from "typescript-ioc";
import yaml from "yaml";
import {UserFilterView} from "../../common/view/user/UserFilterView";
import {FilterGender} from "../../common/enum/FilterGender";

@Singleton
export class UserFilterParser {
    async parseYAML(id: string, userInfoYAML: string): Promise<UserFilterView> {
        const userFilterYAMLObject = yaml.parse(userInfoYAML);
        const userFilterView = new UserFilterView();
        const errors: string[] = [];

        userFilterView.filterGender = userFilterYAMLObject.性別 || null;

        const genderError = UserFilterParser.gender(userFilterView, userFilterYAMLObject.性別);
        const ageError = UserFilterParser.age(userFilterView, userFilterYAMLObject.年齡);
        const heightError = UserFilterParser.height(userFilterView, userFilterYAMLObject.身高);

        if (genderError) errors.push(genderError);
        if (ageError) errors.push(ageError);
        if (heightError) errors.push(heightError);

        if (errors.length > 0) {
            throw errors;
        }

        return userFilterView;
    }

    private static gender(userFilterView: UserFilterView, gender: string): string | void {
        if (!gender) {
            return "「性別」不可為空";
        }

        if (!Object.values(FilterGender).includes(gender as FilterGender)) {
            return "「性別」格式錯誤";
        }

        userFilterView.filterGender = gender as FilterGender;
    }

    private static age(userFilterView: UserFilterView, age: string) {
        if (!age) {
            return "「年齡」不可為空";
        }

        const lowerBoundMatches = age.match(/^(\d+)或以上$/);
        const upperBoundMatches = age.match(/^(\d+)或以下$/);
        const betweenMatches = age.match(/^(\d+)-(\d+)$/);

        if (!lowerBoundMatches && !upperBoundMatches && !betweenMatches && age !== "不限") {
            return "「年齡」格式錯誤";
        }

        if (lowerBoundMatches) {
            const value = Number(lowerBoundMatches[1]);
            userFilterView.filterAgeLowerBound = isNaN(value) ? 18 : Math.max(value, 18);
            userFilterView.filterAgeUpperBound = 99;
        } else if (upperBoundMatches) {
            const value = Number(upperBoundMatches[1]);
            userFilterView.filterAgeLowerBound = 18;
            userFilterView.filterAgeUpperBound = isNaN(value) ? 99 : Math.min(value, 99);
        } else if (betweenMatches) {
            userFilterView.filterAgeLowerBound = Number(betweenMatches[1]);
            userFilterView.filterAgeUpperBound = Number(betweenMatches[2]);
        } else if (age === "不限") {
            userFilterView.filterAgeLowerBound = 18;
            userFilterView.filterAgeUpperBound = 99;
        }
    }

    private static height(userFilterView: UserFilterView, height: string) {
        if (!height) {
            return "「身高」不可為空";
        }

        const lowerBoundMatches = height.match(/^(\d+)或以上$/);
        const upperBoundMatches = height.match(/^(\d+)或以下$/);
        const betweenMatches = height.match(/^(\d+)-(\d+)$/);

        if (!lowerBoundMatches && !upperBoundMatches && !betweenMatches && height !== "不限") {
            return "「身高」格式錯誤";
        }

        if (lowerBoundMatches) {
            const value = Number(lowerBoundMatches[1]);
            userFilterView.filterHeightLowerBound = isNaN(value) ? 140 : Math.max(value, 140);
            userFilterView.filterHeightUpperBound = 220;
        } else if (upperBoundMatches) {
            const value = Number(upperBoundMatches[1]);
            userFilterView.filterHeightLowerBound = 140;
            userFilterView.filterHeightUpperBound = isNaN(value) ? 220 : Math.min(value, 220);
        } else if (betweenMatches) {
            if (Number(betweenMatches[1]) > Number(betweenMatches[2])) {
                return "「身高」格式錯誤";
            }

            userFilterView.filterHeightLowerBound = Number(betweenMatches[1]);
            userFilterView.filterHeightUpperBound = Number(betweenMatches[2]);
        } else if (height === "不限") {
            userFilterView.filterHeightLowerBound = 140;
            userFilterView.filterHeightUpperBound = 220;
        }
    }
}
