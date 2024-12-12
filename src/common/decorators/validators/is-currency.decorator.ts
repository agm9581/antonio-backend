import { applyDecorators } from "@nestjs/common";
import { IsInt, IsNumber, IsPositive, ValidationOptions } from "class-validator";

/**
 * Checks the value to be bigger than 0 and with 2 decimal places
 */
export const IsCurrency = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(IsNumber({maxDecimalPlaces:2},validationOptions), IsPositive(validationOptions));
