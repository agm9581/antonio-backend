import { Module } from '@nestjs/common';

import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payment.service';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Payment,Order])],
  controllers: [PaymentController],
  providers: [PaymentsService],
})
export class PaymentModule {}
