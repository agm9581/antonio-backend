import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/querying/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/querying/util/querying.constants";
import { OrderItemDto } from "./dto/order-item.dto";
import { Product } from "src/product/entities/product.entity";
import { OrderItem } from "./entities/order-item.entity";
import { PaginationService } from "src/querying/pagination.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderitemsRepository: Repository<OrderItem>,
    private readonly paginationService: PaginationService
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto

    const itemsWithPrice = await Promise.all(
      items.map(item => this.createOrderItemWithPrice(item)
      ))
    const order = this.ordersRepository.create({ ...createOrderDto, items: itemsWithPrice });
    return this.ordersRepository.save(order);
  }

  async findAll(paginatioDto: PaginationDto) {
    const { page } = paginatioDto;
    const limit = paginatioDto.limit ?? DEFAULT_PAGE_SIZE.ORDER
    const offset = this.paginationService.calculateOffset(limit, page)

    const [data, count] = await this.ordersRepository.findAndCount({
      skip: offset,
      take: limit
    });
    const meta = this.paginationService.createMeta(limit, page, count)
    return { data, meta }
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
