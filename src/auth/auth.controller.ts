import { Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuardGuard } from './guards/local-auth-guard/local-auth-guard.guard';
import { User } from './decorators/user.decorator';
import { RequestUser } from './interfaces/request-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuardGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@User() user: RequestUser, @Res({ passthrough: true }) response: Response) {
    const token = this.authService.login(user)
    response.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: true
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() { id }: RequestUser) {
    return this.authService.getProfile(id)
  }

}
