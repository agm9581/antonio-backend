import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedingModule } from './seeding/seeding.module';
import databaseConfig from "./config/database.config";

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig.asProvider()), SeedingModule],
})
export class DatabaseModule {}
