import {ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {FieldValidationMessage} from "../../common/core/validation/FieldValidationMessage";
import {Education} from "../domain/Education";
import {Gender} from "../domain/Gender";
import {GoalRelationship} from "../domain/GoalRelationship";
import {Smoking} from "../domain/Smoking";

export class UserInfoView {
    @IsDefined({message: FieldValidationMessage.IS_DEFINED})
    @IsEnum(Gender)
    public gender: Gender | null = null;

    @IsDefined()
    @IsNumber()
    @Min(13)
    @Max(99)
    public age: number | null = null;

    @IsDefined()
    @IsNumber()
    @Min(130)
    @Max(220)
    public height: number | null = null;

    @IsDefined()
    @IsEnum(GoalRelationship)
    public goalRelationship: GoalRelationship | null = null;

    @IsDefined()
    @IsEnum(Smoking)
    public smoking: Smoking | null = null;

    @IsString()
    @IsNotEmpty()
    public occupation: string | null = null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    public salary: number | null = null;

    @IsOptional()
    @IsEnum(Education)
    public education: Education | null = null;

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    public selfIntro: string[] | null = null;

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    public relationshipCriteria: string[] | null = null;
}
