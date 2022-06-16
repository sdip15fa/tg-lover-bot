const propertyNames = Object.freeze({
    name: "暱稱",
    gender: "性別",
    age: "年齡",
    height: "身高",
    goalRelationship: "尋找對象關係",
    smoking: "是否吸煙",
    occupation: "職業",
    salary: "月入",
    education: "學歷",
    selfIntro: "自我介紹",
    relationshipCriteria: "尋找對象",
});

export class LocalizePropertyUtil {
    public static getPropertyName(propertyName: string): string {
        return propertyNames[propertyName];
    }
}
