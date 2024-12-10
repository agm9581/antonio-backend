import { Category } from "src/category/entities/category.entity";
import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
}
