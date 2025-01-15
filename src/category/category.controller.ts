import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PaginationDto } from "src/querying/dto/pagination.dto";
import { IdDto } from "src/common/dto/id.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/roles/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('category')
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Roles(Role.MANAGER)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get()
  findAll(paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Public()
  @Get(":id")
  findOne(@Param() { id }: IdDto) {
    return this.categoryService.findOne(id);
  }

  @Patch(":id")
  update(@Param() { id }: IdDto, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param() { id }: IdDto) {
    return this.categoryService.remove(id);
  }
}
