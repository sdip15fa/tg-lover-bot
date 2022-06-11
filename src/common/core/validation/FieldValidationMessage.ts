import {ValidationArguments} from "class-validator";
import {LocalizePropertyUtil} from "./LocalizePropertyUtil";

type FieldValidationMessageKey = "IS_DEFINED" | "IS_STRING" | "IS_NOT_EMPTY" | "IS_ENUM" | "IS_NUMBER" | "MIN" | "MAX" | "ARRAY_MIN_SIZE" | "ARRAY_MAX_SIZE";

export const FieldValidationMessage: Record<FieldValidationMessageKey, string | ((validationArguments: ValidationArguments) => string)> = Object.freeze({
    IS_DEFINED: (validationArguments: ValidationArguments) => `必須填寫「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」`,
    IS_STRING: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」必須是字串`,
    IS_NOT_EMPTY: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」不可為空`,
    IS_ENUM: (validationArguments: ValidationArguments) => `請輸入有效的「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」`,
    IS_NUMBER: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」必須是數字`,
    MIN: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」必須大於或等於 ${validationArguments.constraints[0]}`,
    MAX: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」必須少於或等於 ${validationArguments.constraints[0]}`,
    ARRAY_MIN_SIZE: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」必須大於或等於 ${validationArguments.constraints[0]} 項`,
    ARRAY_MAX_SIZE: (validationArguments: ValidationArguments) => `「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」必須少於或等於 ${validationArguments.constraints[0]} 項`,
});
