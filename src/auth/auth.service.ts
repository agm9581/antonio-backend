import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService
  ) {

  }

  async validateLocal(email: string, password: string) {
    const user = await this.userRepository.findOne({ select: { id: true, password: true }, where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }


    const isValidPassword = await this.hashingService.compare(password, user.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return { id: user.id }

  }
}
