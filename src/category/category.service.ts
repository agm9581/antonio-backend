import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/querying/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/querying/util/querying.constants";
import { PaginationService } from "src/querying/pagination.service";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly paginationService: PaginationService

  ) { }
  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(paginatioDto: PaginationDto) {
    const { page } = paginatioDto;
    const limit = paginatioDto.limit ?? DEFAULT_PAGE_SIZE.CATEGORY
    const offset = this.paginationService.calculateOffset(limit, page)
    const [data, count] = await this.categoryRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    const meta = this.paginationService.createMeta(limit, page, count)
    return { data, meta }
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOneOrFail({ where: { id }, relations: { products: true } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({ id, ...updateCategoryDto });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.products.length) {
      throw new ConflictException('Category has related products')
    }
    return this.categoryRepository.remove(category);
  }
}
