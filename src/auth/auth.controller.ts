import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuardGuard } from './guards/local-auth-guard/local-auth-guard.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuardGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return req.user
  }
}
