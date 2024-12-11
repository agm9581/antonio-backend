import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { Category } from 'src/category/entities/category.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { Payment } from 'src/payment/entities/payment.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedingService {
    constructor(private readonly dataSource: DataSource) {

    }
    async seed() {
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const usersRepository = queryRunner.manager.getRepository(User)
            const categoryRepository = queryRunner.manager.getRepository(Category)
            const productRepository = queryRunner.manager.getRepository(Product)
            const orderRepository = queryRunner.manager.getRepository(Order)
            const orderItemRepository = queryRunner.manager.getRepository(OrderItem)
            const paymentRepository = queryRunner.manager.getRepository(Payment)

            const orders = await orderRepository.find()
            await orderRepository.remove(orders)
            const users = await usersRepository.find()
            await usersRepository.remove(users)
            const products = await productRepository.find()
            await productRepository.remove(products)
            const categories = await categoryRepository.find()
            await categoryRepository.remove(categories)

            const cat1 = categoryRepository.create({ name: 'Electronics' })
            const cat2 = categoryRepository.create({ name: 'Books' })
            const cat3 = categoryRepository.create({ name: 'Computers' })
            const cat4 = categoryRepository.create({ name: 'Games' })

            await categoryRepository.save([cat1, cat2, cat3, cat4])

            const p1 = productRepository.create({
                name: 'Book of Cain',
                description: 'The writings of an elderly scholar about this perilous world.',
                price: 102.5,
                categories: [cat2]
            })
            const p2 = productRepository.create({
                name: 'Smart TV',
                price: 2350,
                categories: [cat1, cat3]
            })
            const p3 = productRepository.create({
                name: 'MacBook Pro',
                price: 1200,
                categories: [cat3]
            })
            const p4 = productRepository.create({
                name: 'Gaming PC',
                description: 'Latest generation hardware for the best experience.',
                price: 2000,
                categories: [cat3]
            })
            const p5 = productRepository.create({
                name: 'Game Mechanics: Advanced Game Design',
                description: 'Learn how to craft well-designed game mechanics.',
                price: 149.9,
                categories: [cat2]
            })
            const p6 = productRepository.create({
                name: 'Warcraft III: Reign of Chaos',
                description: 'A true classic of the RTS genre.',
                price: 25.99,
                categories: [cat4]
            })

            await productRepository.save([p1, p2, p3, p4, p5, p6])

            const u1 = usersRepository.create({
                name: 'Pedro Farla',
                email: 'jarulf@mail.com',
                phone: '131231',
                password: '123124'
            })
            const u2 = usersRepository.create({
                name: 'Pedro Farla',
                email: 'aaaasd@mail.com',
                phone: '131231',
                password: '13sfd1'
            })

            await usersRepository.save([u1, u2])

            const oi1 = orderItemRepository.create({
                product: p1,
                quantity: 2,
                price: p1.price
            })

            const oi2 = orderItemRepository.create({
                product: p3,
                quantity: 1,
                price: p3.price
            })
            const oi3 = orderItemRepository.create({
                product: p3,
                quantity: 2,
                price: p3.price
            })
            const oi4 = orderItemRepository.create({
                product: p5,
                quantity: 2,
                price: p5.price
            })

            const pay1 = paymentRepository.create()

            const o1 = orderRepository.create({
                customer: u1,
                items: [oi1, oi2],
                status: OrderStatus.AWAITING_SHIPMENT,
                payment: pay1

            })
            const o2 = orderRepository.create({
                customer: u2,
                items: [oi3],
                status: OrderStatus.AWAITING_PAYMENT,

            })
            const o3 = orderRepository.create({
                customer: u1,
                items: [oi4],
                status: OrderStatus.AWAITING_PAYMENT,
            })

            await queryRunner.commitTransaction()

        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }

    }
}
