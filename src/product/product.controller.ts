import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { ProductsService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { IdDto } from "src/common/dto/id.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Role } from "src/auth/roles/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { ApiTags } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { createFileValidators } from "src/files/util/file-validation.util";
@ApiTags('product')
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductsService) { }

  @Roles(Role.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Public()
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

  @UseInterceptors(FilesInterceptor('files', 5))
  @Post(':id/images')
  uploadImages(@UploadedFile(new ParseFilePipe({ validators: createFileValidators('2MB', 'png', "jpeg") })) files: Express.Multer.File[]) {
    return files
  }
}
