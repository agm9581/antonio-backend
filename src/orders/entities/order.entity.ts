import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { RegistryDates } from "src/common/embedded/registry-dates.embedded";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    status:OrderStatus

    @Column()
    registryDates: RegistryDates

}
