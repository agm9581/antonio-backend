import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { IdDto } from "src/common/dto/id.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get(":id")
  findOne(@Param() { id }: IdDto) {
    return this.productService.findOne(id);
  }

  @Patch(":id")
  update(@Param() { id }: IdDto, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param() { id }: IdDto) {
    return this.productService.remove(id);
  }
}
