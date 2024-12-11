import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { User } from "src/users/entities/user.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { OrderItem } from "./order-item.entity";

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

    @OneToOne(()=>Payment, payment => payment.order, {cascade:true})
    payment:Payment

    @OneToMany(()=> OrderItem, item => item.order, {cascade:true})
    items: OrderItem[]
}
