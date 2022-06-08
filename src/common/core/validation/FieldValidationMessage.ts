import {ValidationArguments} from "class-validator";
import {LocalizePropertyUtil} from "./LocalizePropertyUtil";

type FieldValidationMessageKey = "IS_DEFINED";

export const FieldValidationMessage: Record<FieldValidationMessageKey, string | ((validationArguments: ValidationArguments) => string)> = Object.freeze({
    IS_DEFINED: (validationArguments: ValidationArguments) => `必須填寫「${LocalizePropertyUtil.getPropertyName(validationArguments.property)}」`,
});
