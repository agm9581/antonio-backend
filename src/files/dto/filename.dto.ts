import { IsString } from "class-validator";

export class FileNameDto {
    @IsString()
    readonly filename: string
}