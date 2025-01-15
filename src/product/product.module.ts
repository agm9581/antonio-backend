import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FilesModule } from 'src/files/files.module';
import { ProductsSubscriber } from './subscribers/products.subscribers';
import { QueryingModule } from 'src/querying/querying.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilesModule, QueryingModule],
  controllers: [ProductController],
  providers: [ProductsService, ProductsSubscriber],
})
export class ProductModule { }
