import { applyDecorators } from "@nestjs/common";
import { IsInt, IsPositive } from "class-validator";

export const IsCardinal = () => applyDecorators(IsInt(), IsPositive());
