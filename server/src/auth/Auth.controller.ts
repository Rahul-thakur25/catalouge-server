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
    const { accessToken, userId } = await this.authService.login(user);
    res.cookie('accessToken', accessToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: 'Login successful', userId, accessToken });
  }
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    return res.status(200).json({ message: 'Logout successful' });
  }
}
