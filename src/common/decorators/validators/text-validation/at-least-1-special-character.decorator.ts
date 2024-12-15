import { buildMessage, matches, ValidateBy, ValidationOptions } from "class-validator"




const AT_LEAST_ONE_SPECIAL_CHARACTER_REGEX = /(?=.*[@$!%*?&])/



const AT_LEAST_ONE_SPECIAL_CHARACTER = 'atLeastOneSpecialCharacter'

function atLeastOneSpecialCharacter(value: string): boolean {
    return matches(value, AT_LEAST_ONE_SPECIAL_CHARACTER_REGEX)
}

export const AtLeastOneSpecialCharacter = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return ValidateBy({
        name: AT_LEAST_ONE_SPECIAL_CHARACTER,
        validator: {
            validate: (value): boolean => atLeastOneSpecialCharacter(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + '$property must contain at least one special character', validationOptions)

        }
    }, validationOptions)
}