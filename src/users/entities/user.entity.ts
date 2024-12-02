import { RegistryDates } from "src/common/embedded/registry-dates.embedded";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column(() => RegistryDates, { prefix: false })
  //Embedded entity not a primitive type, anonymous function returning the type
  registryDates: RegistryDates;
}
