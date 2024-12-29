import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/common/util/common.constants";
import { OrderItemDto } from "./dto/order-item.dto";
import { Product } from "src/product/entities/product.entity";
import { OrderItem } from "./entities/order-item.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderitemsRepository: Repository<OrderItem>,
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto

    const itemsWithPrice = await Promise.all(
      items.map(item => this.createOrderItemWithPrice(item)
      ))
    const order = this.ordersRepository.create({ ...createOrderDto, items: itemsWithPrice });
    return this.ordersRepository.save(order);
  }

  findAll(paginatioDto: PaginationDto) {
    const { limit, offset } = paginatioDto;
    return this.ordersRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.ORDER,
    });
  }

  async findOne(id: number) {
    return await this.ordersRepository.findOneOrFail({ where: { id }, relations: { items: { product: true }, customer: true, payment: true } });
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.ordersRepository.remove(order);
  }

  private async createOrderItemWithPrice(orderItemDto: OrderItemDto) {
    const { id } = orderItemDto.product

    const product = await this.productsRepository.findOneBy({ id })
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    const { price } = product

    const orderItem = this.orderitemsRepository.create({ ...orderItemDto, price })
    return orderItem
  }
}
