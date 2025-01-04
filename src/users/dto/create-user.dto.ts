import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from "class-validator";
import { IsPassword } from "src/common/decorators/validators/is-password.decorator";

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber("ES")
  readonly phone: string;

  /**
 * Checks if the value is a string following these rules:
 * 1. 8 to 20 characters
 * 2. At least one
 * - Lowercase letter
 * - Uppercase Letter
 * - Number
 * - Special character
 */
  @IsPassword()
  readonly password: string;
}
