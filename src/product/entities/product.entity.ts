import { Category } from "src/category/entities/category.entity";
import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { OrderItem } from "src/orders/entities/order-item.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 6, scale: 2 })
  price: number;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @ManyToMany(() => Category, (categories) => categories.products)
  @JoinTable({ name: "product_to_category" })
  categories: Category[];

  @OneToMany(()=> OrderItem, item => item.product)
  items: OrderItem[]

  get orders(){
    return this.items.map(item =>item.order)
  }
}
