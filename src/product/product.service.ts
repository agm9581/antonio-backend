import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/querying/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/querying/util/querying.constants";
import { StorageService } from "src/files/storage/storage.service";
import { BASE_PATH, FilePath, MaxFileCount } from "src/files/util/file.constants";
import { join } from "path";
import { pathExists } from "fs-extra";
import { PaginationService } from "src/querying/pagination.service";

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly storageService: StorageService,
    private readonly paginationService: PaginationService
  ) { }
  create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(paginatioDto: PaginationDto) {
    const { page } = paginatioDto;
    const limit = paginatioDto.limit ?? DEFAULT_PAGE_SIZE.PRODUCT
    const offset = this.paginationService.calculateOffset(limit, page)
    const [data, count] = await this.productsRepository.findAndCount({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.PRODUCT,
    });
    const meta = this.paginationService.createMeta(limit, page, count)
    return { data, meta }
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
