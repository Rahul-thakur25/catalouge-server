import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/User.model';
import { registerDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService, // Ensure JwtService is properly injected
  ) {}

  async register(user: registerDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      if (!hashedPassword) {
        throw new HttpException(
          'Failed to hash password',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const refreshToken = this.jwtService.sign(
        {
          email: user.email,
          role: user.role,
        },
        {
          expiresIn: '7d',
        },
      );

      const newUser = new this.userModel({
        ...user,
        password: hashedPassword,
        refreshToken,
      });

      await newUser.save();
      return {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async login(user: registerDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (!existingUser) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const isPasswordValid = await bcrypt.compare(
        user.password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const refreshToken = this.jwtService.sign({
        email: existingUser.email,
        role: existingUser.role,
      });

      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      return { accessToken: refreshToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
