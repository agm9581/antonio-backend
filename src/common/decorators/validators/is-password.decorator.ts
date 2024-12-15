import { applyDecorators } from "@nestjs/common"
import { buildMessage, Length, matches, ValidateBy, ValidationOptions } from "class-validator"
import { AtLeastOneLowerCaseLetter } from "./text-validation/at-least-1-lowercase-letter.decorator copy"
import { AtLeastOneSpecialCharacter } from "./text-validation/at-least-1-special-character.decorator"
import { AtLeastOneUpperCaseLetter } from "./text-validation/at-least-1-uppercase-letter.decorator"
import { AtLeastOnedigit } from "./text-validation/at-least-1-digit.decorator"
import { OnlyRequiredCharacters } from "./text-validation/only-required-characters.decorator"





export const IsPassword = (validationOptions?: ValidationOptions): PropertyDecorator =>
    applyDecorators(AtLeastOneLowerCaseLetter(validationOptions),
        AtLeastOneSpecialCharacter(validationOptions),
        AtLeastOneUpperCaseLetter(validationOptions),
        AtLeastOnedigit(validationOptions),
        OnlyRequiredCharacters(validationOptions),
        Length(8, 20, validationOptions)
    )
