import { buildMessage, matches, ValidateBy, ValidationOptions } from "class-validator"




const AT_LEAST_ONE_LOWER_CASE_LETTER_REGEX = /(?=.*[a-z])/



const AT_LEAST_ONE_LOWER_CASE_LETTER_KEY = 'atLeastOneLowerCaseLetter'

function atLeastOneLowerCaseLetter(value: string): boolean {
    return matches(value, AT_LEAST_ONE_LOWER_CASE_LETTER_REGEX)
}

export const AtLeastOneLowerCaseLetter = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return ValidateBy({
        name: AT_LEAST_ONE_LOWER_CASE_LETTER_KEY,
        validator: {
            validate: (value): boolean => atLeastOneLowerCaseLetter(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + '$property must contain at least one lower case letter', validationOptions)

        }
    }, validationOptions)
}