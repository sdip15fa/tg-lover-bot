import {FilterGender} from "../../enum/FilterGender";
import {FieldValidationMessage} from "../../core/validation/FieldValidationMessage";
import {IsDefined, IsEnum} from "class-validator";

export class UserFilterView {
    @IsDefined({message: FieldValidationMessage.IS_DEFINED})
    @IsEnum(FilterGender, {message: FieldValidationMessage.IS_ENUM})
    public filterGender: FilterGender | undefined;

    public filterAgeLowerBound: number | undefined;

    public filterAgeUpperBound: number | undefined;

    public filterHeightLowerBound: number | undefined;

    public filterHeightUpperBound: number | undefined;
}
