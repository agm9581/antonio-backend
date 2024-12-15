import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from "class-validator";
import { isPassword } from "src/common/decorators/validators/is-password.decorator";

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber("ES")
  readonly phone: string;

  @isPassword()
  readonly password: string;
}
