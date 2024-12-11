import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payment.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IdDto } from 'src/common/dto/id.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentsService) { }

  @Post(':id')
  payOrder(@Param() { id }: IdDto) {
    return this.paymentService.payOrder(id)
  }
}
