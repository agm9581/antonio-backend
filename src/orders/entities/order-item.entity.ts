import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/entities/product.entity";

@Entity()
export class OrderItem{
    @Column()
    quantity: number

    @Column({type:'decimal', precision:6, scale: 2})
    price:number

    @ManyToOne(()=> Product, product => product.items)
    product:Product

    @ManyToOne(()=> Order,  order=> order.items, {onDelete:'CASCADE'})
    order:Order

    @PrimaryColumn()
    orderId:number
    @PrimaryColumn()
    productId:number

 
}