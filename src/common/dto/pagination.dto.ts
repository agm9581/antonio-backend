import { IsInt, IsOptional, IsPositive } from "class-validator";
import { IsCardinal } from "../decorators/is-cardinal.decorator";

export class PaginationDto {
  @IsOptional()
  @IsCardinal()
  limit: number;

  @IsOptional()
  @IsCardinal()
  offset: number;
}
