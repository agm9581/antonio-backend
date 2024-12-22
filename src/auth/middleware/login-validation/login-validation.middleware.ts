import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    const loginDto = plainToInstance(LoginDto, req.body)
    const errors = await validate(loginDto, { whitelist: true, forbidNonWhitelisted: true })
    if (errors.length) {
      const errorMessages = errors.map(e => Object.values(e.constraints).join())
      throw new BadRequestException(errorMessages)
    }
    next();
  }
}
