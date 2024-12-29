
import { ConflictException, Injectable, NotFoundException, Query } from '@nestjs/common';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { RequestUser } from 'src/auth/interfaces/request-user.interface';
import { Role } from 'src/auth/roles/enums/role.enum';
import { compareUserId } from 'src/auth/util/authorization.util';

@Injectable()
export class PaymentsService {
	constructor(
		@InjectRepository(Payment)
		private readonly paymentRepository: Repository<Payment>,
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>
	) {

	}
	async payOrder(id: number, currentUser: RequestUser) {
		const order = await this.orderRepository.findOneOrFail({ where: { id }, relations: { payment: true, customer: true } })

		if (currentUser.role !== Role.ADMIN) {
			compareUserId(currentUser.id, id)
		}
		if (order.payment) {
			throw new ConflictException('Order already paid')
		}

		const payment = this.paymentRepository.create()
		order.payment = payment
		order.status = OrderStatus.AWAITING_SHIPMENT
		return this.orderRepository.save(order)
	}
}
