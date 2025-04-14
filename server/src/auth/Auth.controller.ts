import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express'; // Import Response type from express
import { registerDto } from './dto/register.dto';
import { AuthService } from './Auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: registerDto) {
    const newUser = await this.authService.register(user);
    return newUser;
  }

  @Post('login')
  async login(@Body() user: registerDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(user);
    res.cookie('refreshToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // Prevent CSRF
      path: '/auth/refresh', // Optional: restrict to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({ accessToken });
  }
}
