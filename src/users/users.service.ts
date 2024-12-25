import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/common/util/common.constants";
import { genSalt } from "bcrypt";
import { hash } from "crypto";
import { HashingService } from "src/auth/hashing/hashing.service";
import { RequestUser } from "src/auth/interfaces/request-user.interface";
import { Role } from "src/auth/roles/enums/role.enum";
import { compareUserId } from "src/auth/util/authorization.util";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {

    const user = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(user);
  }

  findAll(paginatioDto: PaginationDto) {
    const { limit, offset } = paginatioDto;
    return this.usersRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id }, relations: { orders: { items: true, payment: true } } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, curentUser: RequestUser) {
    if (curentUser.role !== Role.ADMIN) {
      compareUserId(curentUser.id, id)
    }
    const user = await this.usersRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number, soft: boolean, curentUser: RequestUser) {
    if (curentUser.role !== Role.ADMIN) {
      compareUserId(curentUser.id, id)
      if (!soft) {
        throw new ForbiddenException('Forbidden delete method')
      }
    }
    const user = await this.findOne(id);
    return soft ? this.usersRepository.softRemove(user) :
      this.usersRepository.remove(user);
  }

  async recover(id: number, curentUser: RequestUser) {
    if (curentUser.role !== Role.ADMIN) {
      compareUserId(curentUser.id, id)
    }
    const user = await this.usersRepository.findOne({ where: { id }, relations: { orders: { items: true, payment: true } }, withDeleted: true });
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.isDeleted) {
      throw new ConflictException('User not deleted')
    }
    return this.usersRepository.recover(user)
  }
}
