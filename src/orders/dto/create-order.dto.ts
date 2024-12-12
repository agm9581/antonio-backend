import { IsEntity } from "src/common/decorators/validators/is-entity.decorator";
import { IdDto } from "src/common/dto/id.dto";
import { Product } from "src/product/entities/product.entity";
import { Entity } from "typeorm";
import { OrderItemDto } from "./order-item.dto";
import { ArrayNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@Entity()
export class CreateOrderDto {

    @IsEntity()
    readonly customer: IdDto

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => OrderItemDto)
    readonly items: OrderItemDto[]

}
