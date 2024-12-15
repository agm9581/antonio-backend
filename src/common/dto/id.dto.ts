import { IsInt, IsPositive } from "class-validator";
import { IsCardinal } from "../decorators/validators/is-cardinal.decorator";

export class IdDto {
  //For uuid checking IsUUID()
  @IsCardinal()
  readonly id: number;
}
