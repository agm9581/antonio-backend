import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FilesModule } from 'src/files/files.module';
import { ProductsSubscriber } from './subscribers/products.subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilesModule],
  controllers: [ProductController],
  providers: [ProductsService, ProductsSubscriber],
})
export class ProductModule { }
