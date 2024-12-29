import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/common/util/common.constants";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }
  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(paginatioDto: PaginationDto) {
    const { limit, offset } = paginatioDto;
    return this.categoryRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.CATEGORY,
    });
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
