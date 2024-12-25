import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuardGuard } from './guards/local-auth-guard/local-auth-guard.guard';
import { User } from './decorators/user.decorator';
import { RequestUser } from './interfaces/request-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { IdDto } from 'src/common/dto/id.dto';
import { RoleDto } from './roles/dto/role.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
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


  @Get('profile')
  getProfile(@User() { id }: RequestUser) {
    return this.authService.getProfile(id)
  }

  @Patch(':id/assign')
  assignRole(@Param() { id }: IdDto, @Body() { role }: RoleDto) {
    return this.authService.assignRole(id, role)
  }

}
