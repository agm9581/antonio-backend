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
import { PaginationDto } from "src/querying/dto/pagination.dto";
import { IdDto } from "src/common/dto/id.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Role } from "src/auth/roles/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { createFileValidators, createParseFilePipe } from "src/files/util/file-validation.util";
import { MaxFileCount, MULTIPART_FORMDATA_KEY } from "src/files/util/file.constants";
import { IdFilenameDto } from "src/files/dto/id-filename.dto";
import { FilesSchema } from "src/files/swagger/schemas/files.schema";
import { FileSchema } from "src/files/swagger/schemas/file.schema";
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

  @Roles(Role.MANAGER)
  @Delete(":id")
  remove(@Param() { id }: IdDto) {
    return this.productService.remove(id);
  }

  @ApiConsumes(MULTIPART_FORMDATA_KEY)
  @ApiBody({ type: FileSchema })
  @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCT_IMAGES))
  @Post(':id/images')
  uploadImages(@Param() { id }: IdDto, @UploadedFile(createParseFilePipe('2MB', 'png', 'jpeg')) files: Express.Multer.File[]) {
    return this.productService.uploadImages(id, files)
  }

  @ApiOkResponse({ type: FilesSchema })
  @Public()
  @Get(':id/images/:filename')
  downloadImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productService.downloadImage(id, filename)
  }

  @Roles(Role.MANAGER)
  @Delete(':id/images/:filename')
  deleteImage(@Param() { id, filename }: IdFilenameDto) {
    return this.productService.deleteImage(id, filename)
  }
}
