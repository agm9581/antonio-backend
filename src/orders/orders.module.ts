import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { QueryingModule } from 'src/querying/querying.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product]), QueryingModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
