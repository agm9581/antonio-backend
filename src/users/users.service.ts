import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/querying/dto/pagination.dto";
import { DEFAULT_PAGE_SIZE } from "src/querying/util/querying.constants";
import { genSalt } from "bcrypt";
import { hash } from "crypto";
import { HashingService } from "src/auth/hashing/hashing.service";
import { RequestUser } from "src/auth/interfaces/request-user.interface";
import { Role } from "src/auth/roles/enums/role.enum";
import { compareUserId } from "src/auth/util/authorization.util";
import { LoginDto } from "src/auth/dto/login.dto";
import { PaginationService } from "src/querying/pagination.service";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly paginationService: PaginationService
  ) { }
  async create(createUserDto: CreateUserDto) {

    const user = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(user);
  }

  async findAll(paginatioDto: PaginationDto) {

    const { page } = paginatioDto;
    const limit = paginatioDto.limit ?? DEFAULT_PAGE_SIZE.USER;
    const offset = this.paginationService.calculateOffset(limit, page)
    const [data, count] = await this.usersRepository.findAndCount({
      skip: offset,
      take: limit
    });
    const meta = this.paginationService.createMeta(limit, page, count)

    return { data, meta }
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneOrFail({ where: { id }, relations: { orders: { items: true, payment: true } } });
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

  async recover(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.usersRepository.findOneOrFail({ where: { email }, relations: { orders: { items: true, payment: true } }, withDeleted: true });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const isValidPassword = await this.hashingService.compare(password, user.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.isDeleted) {
      throw new ConflictException('User not deleted')
    }
    return this.usersRepository.recover(user)
  }
}
