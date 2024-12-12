import { Type } from "class-transformer";
import { ArrayNotEmpty, IsCurrency, IsNumber, IsOptional, IsPositive, Length, ValidateNested } from "class-validator";
import { IsCardinal } from "src/common/decorators/validators/is-cardinal.decorator";
import { IsEntity } from "src/common/decorators/validators/is-entity.decorator";
import { IdDto } from "src/common/dto/id.dto";

export class CreateProductDto {


    @Length(2, 50)
    readonly name: string;

    @IsOptional()
    @Length(1, 500)
    readonly description: string

    @IsCurrency()
    readonly price: number

    @ArrayNotEmpty()
    @IsEntity()
    readonly categories: IdDto[]
}
