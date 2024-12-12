import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsInt, IsPositive, ValidateNested, ValidationOptions } from "class-validator";
import { IdDto } from "../../dto/id.dto";

/**
 * Check if the value is an object with only a serial id
 */
export const IsEntity = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(ValidateNested(validationOptions), Type(() => IdDto));
