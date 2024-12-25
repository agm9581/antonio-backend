import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IdDto } from "src/common/dto/id.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { RemoveDto } from "src/common/dto/remove.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/roles/enums/role.enum";
import { User } from "src/auth/decorators/user.decorator";
import { RequestUser } from "src/auth/interfaces/request-user.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.MANAGER)
  @Get()
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.usersService.findAll(paginatioDto);
  }

  @Roles(Role.MANAGER)
  @Get(":id")
  findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(@Param() { id }: IdDto, @Body() updateUserDto: UpdateUserDto, @User() user: RequestUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Patch(":id/recover")
  recover(@Param() { id }: IdDto, @User() user: RequestUser) {
    return this.usersService.recover(id, user);
  }

  @Delete(":id")
  remove(@Param() { id }: IdDto, @Query() { soft }: RemoveDto, @User() user: RequestUser) {
    return this.usersService.remove(id, soft, user);
  }
}
