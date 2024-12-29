import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from './roles/enums/role.enum';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService
  ) {

  }

  async validateLocal(email: string, password: string) {
    const user = await this.userRepository.findOneOrFail({ select: { id: true, password: true }, where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }


    const isValidPassword = await this.hashingService.compare(password, user.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.createRequestUser(user)

  }

  login(user: RequestUser) {
    const payload: JwtPayload = { sub: user.id }
    return this.jwtService.sign(payload)
  }

  async validateJwt(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub })
    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }

    return this.createRequestUser(user)
  }

  getProfile(id: number) {
    return this.userRepository.findOneBy({ id })
  }

  async assignRole(id: number, role: Role) {
    const user = await this.userRepository.preload({ id, role });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.userRepository.save(user);
  }

  private createRequestUser(user: User) {
    const { id, role } = user
    const requestUser: RequestUser = { id, role }
    return requestUser
  }
}
