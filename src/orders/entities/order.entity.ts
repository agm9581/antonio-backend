import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id:number
    @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.AWAITING_PAYMENT})
    status:OrderStatus

    @Column(()=>  RegistryDates, {prefix: false})
    registryDates: RegistryDates

    @ManyToMany(()=> User, (customer) => customer.orders, {nullable:false })
    customer:User
}
