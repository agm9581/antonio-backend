import { IsBoolean, IsOptional } from "class-validator";


export class RemoveDto {
    @IsOptional()
    @IsBoolean()
    readonly soft?: boolean
}