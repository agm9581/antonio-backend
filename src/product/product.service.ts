import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/common/util/common.constants";
import { StorageService } from "src/files/storage/storage.service";
import { BASE_PATH, FilePath, MaxFileCount } from "src/files/util/file.constants";
import { join } from "path";
import { pathExists } from "fs-extra";

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly storageService: StorageService
  ) { }
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
    return await this.productsRepository.findOneOrFail({ where: { id }, relations: { orders: true } });
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
    await this.productsRepository.remove(product);
    await this.deleteBaseDir(id)
    return product
  }

  async uploadImages(id: number, files: Express.Multer.File[]) {
    await this.findOne(id)

    const { BASE, IMAGES } = FilePath.Products
    const path = join(BASE, id.toString(), IMAGES)

    if (await pathExists(join(BASE_PATH, path))) {
      const incomingFilecount = files.length
      const dirFileCount = await this.storageService.getDirFilecount(path)
      const totalFileCount = incomingFilecount + dirFileCount

      this.storageService.validateFileCount(totalFileCount, MaxFileCount.PRODUCT_IMAGES)

    }

    await this.storageService.createDir(path)
    await Promise.all(
      files.map(file => this.storageService.saveFile(path, file))
    )
  }
  async downloadImage(id: number, filename: string) {
    await this.findOne(id)

    const { BASE, IMAGES } = FilePath.Products
    const path = join(BASE, id.toString(), IMAGES, filename)

    await this.storageService.validatePath(path)
    return this.storageService.getFile(path)
  }

  async deleteImage(id: number, filename: string) {
    await this.findOne(id)

    const { BASE, IMAGES } = FilePath.Products
    const path = join(BASE, id.toString(), IMAGES, filename)

    await this.storageService.validatePath(path)
    return this.storageService.delete(path)
  }

  private async deleteBaseDir(id: number) {
    const { BASE } = FilePath.Products

    const path = join(BASE, id.toString())
    await this.storageService.delete(path)
  }
}
