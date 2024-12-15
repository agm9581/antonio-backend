import { buildMessage, matches, ValidateBy, ValidationOptions } from "class-validator"




const AT_LEAST_ONE_DIGIT_REGEX = /(?=.*\d)/



const AT_LEAST_ONE_DIGIT = 'atLeastOnedigit'

function atLeastOnedigit(value: string): boolean {
    return matches(value, AT_LEAST_ONE_DIGIT_REGEX)
}

export const AtLeastOnedigit = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return ValidateBy({
        name: AT_LEAST_ONE_DIGIT,
        validator: {
            validate: (value): boolean => atLeastOnedigit(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + '$property must contain at least one digit', validationOptions)

        }
    }, validationOptions)
}