import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/entities/product.entity";
import { Expose } from "class-transformer";

@Entity()
export class OrderItem {
    @Column()
    quantity: number

    @Column({ type: 'decimal', precision: 6, scale: 2 })
    price: number

    @DeleteDateColumn()
    deletedAt: Date

    @ManyToOne(() => Product, product => product.items)
    product: Product

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    order: Order

    @PrimaryColumn()
    orderId: number
    @PrimaryColumn()
    productId: number

    @Expose()
    get subTotal() {
        return this.quantity * this.price
    }

}