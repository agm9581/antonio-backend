import { buildMessage, matches, ValidateBy, ValidationOptions } from "class-validator"




const AT_LEAST_ONE_UPPER_CASE_LETTER_REGEX = /(?=.*[A-Z])/



const AT_LEAST_ONE_UPPER_CASE_LETTER_KEY = 'atLeastOneUpperCaseLetter'

function atLeastOneUpperCaseLetter(value: string): boolean {
    return matches(value, AT_LEAST_ONE_UPPER_CASE_LETTER_REGEX)
}

export const AtLeastOneUpperCaseLetter = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return ValidateBy({
        name: AT_LEAST_ONE_UPPER_CASE_LETTER_KEY,
        validator: {
            validate: (value): boolean => atLeastOneUpperCaseLetter(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + '$property must contain at least one upper case letter', validationOptions)

        }
    }, validationOptions)
}