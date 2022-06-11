import {Gender} from "../../common/enum/Gender";
import {GoalRelationship} from "../../common/enum/GoalRelationship";
import {Smoking} from "../../common/enum/Smoking";
import {Education} from "../../common/enum/Education";
import {FilterGender} from "../../common/enum/FilterGender";

export interface User {
    telegram_id: string;
    agree_terms: boolean;
    agree_username_permission: boolean;
    gender: Gender;
    age: number;
    height: number;
    goal_relationship: GoalRelationship;
    smoking: Smoking;
    occupation?: string | null;
    salary?: number | null;
    education?: Education | null;
    self_intro?: string | null;
    relationship_criteria?: string | null;
    photo_urls?: {data: string[]} | null;
    info_updated: boolean;
    photo_uploaded: boolean;
    filter_updated: boolean;
    filter_gender: FilterGender;
    filter_age_upper_bound: number;
    filter_age_lower_bound: number;
    filter_height_upper_bound: number;
    filter_height_lower_bound: number;
}
