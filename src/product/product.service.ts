import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/common/util/common.constants";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  findAll(paginatioDto: PaginationDto) {
    const { limit, offset } = paginatioDto;
    return this.productsRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.PRODUCT,
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ where:{id}, relations:{orders:true}});
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({ id, ...updateProductDto });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}
