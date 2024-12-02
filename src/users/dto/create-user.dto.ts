import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber("ES")
  readonly phone: string;

  @IsString()
  readonly password: string;
}
