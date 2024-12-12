import { IsInt, IsPositive } from "class-validator";
import { IsCardinal } from "../decorators/validators/is-cardinal.decorator";

export class IdDto {
  @IsCardinal()
  readonly id: number;
}
