import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OrderItem,Order,Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
