import { buildMessage, matches, ValidateBy, ValidationOptions } from "class-validator"




const ONLY_REQUIRED_CHARACTERS_REGEX = /[A-Za-z\d@$!%*?&]/



const ONLY_REQUIRED_CHARACTERS = 'onlyRequiredCharacters'

function onlyRequiredCharacters(value: string): boolean {
    return matches(value, ONLY_REQUIRED_CHARACTERS_REGEX)
}

export const OnlyRequiredCharacters = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return ValidateBy({
        name: ONLY_REQUIRED_CHARACTERS,
        validator: {
            validate: (value): boolean => onlyRequiredCharacters(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + '$property must contain only uppercase letters, lowercase letters, digits, and the special characters @$!%*?&', validationOptions)

        }
    }, validationOptions)
}