import { buildMessage, matches, ValidateBy, ValidationOptions } from "class-validator"




const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/



const IS_PASSWORD_KEY = 'isPassword'

function isPass(value: string): boolean {
    return matches(value, PASSWORD_REGEX)
}

export const isPassword = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return ValidateBy({
        name: IS_PASSWORD_KEY,
        validator: {
            validate: (value): boolean => isPass(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + '$property must be a valid password', validationOptions)

        }
    }, validationOptions)
}