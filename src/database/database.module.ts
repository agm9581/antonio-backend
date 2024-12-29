import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedingModule } from './seeding/seeding.module';
import databaseConfig from "./config/database.config";
import { NotFoundExceptionFilter } from "./exception-filters/not-found-exception/not-found-exception.filter";
import { APP_FILTER } from "@nestjs/core";
import { DatabaseExceptionFilter } from "./exception-filters/database-exception/database-exception.filter";

@Module({
  imports: [TypeOrmModule.forRootAsync(databaseConfig.asProvider()), SeedingModule],
  providers: [{ provide: APP_FILTER, useClass: NotFoundExceptionFilter }, { provide: APP_FILTER, useClass: DatabaseExceptionFilter }]
})
export class DatabaseModule { }
