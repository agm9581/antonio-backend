import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { OrderStatus } from "src/orders/enums/order-status.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "./payment-status.enum";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id:number

    @Column(()=>RegistryDates, {prefix:false})
    registryDates: RegistryDates

    @OneToOne(()=> Order, order => order.payment, {nullable:true, onDelete:'CASCADE'})
    @JoinColumn()
    order:Order


    
}
