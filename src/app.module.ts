import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { QueryingModule } from './querying/querying.module';

@Module({
  imports: [UsersModule, CommonModule, DatabaseModule, EnvModule, OrdersModule, PaymentModule, CategoryModule, ProductModule, AuthModule, FilesModule, QueryingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
