import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/config/mongo.config';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register-dto';
import { SigninDto } from './dto/signin-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel
        .findOne({ email: registerDto.email })
        .exec();
      if (existingUser) {
        return {
          message: 'Account already exists',
          statusCode: 400,
        };
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);

      // Create a new user instance
      const createdUser = new this.userModel({
        ...registerDto,
        password: hashedPassword,
      });

      // Save the new user to the database
      await createdUser.save();

      return {
        message: 'User registered successfully',
        statusCode: 201,
      };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new Error(`User registration failed: ${error.message || error}`);
    }
  }
  async signin(
    signinDto: SigninDto,
  ): Promise<{ message: string; statusCode: number; accessToken?: string }> {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel
        .findOne({ email: signinDto.email })
        .exec();
      if (!existingUser) {
        return {
          message: 'account wrong',
          statusCode: 404,
        };
      }
      const isPasswordValid = await bcrypt.compare(
        signinDto.password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        return {
          message: 'password wrong',
          statusCode: 404,
        };
      }
      const payload = { id: existingUser.id, fullName: existingUser.fullName };
      const accessToken = await this.jwtService.signAsync(payload);
      if (!accessToken) {
        throw new Error();
      }
      return {
        message: 'User login successfully',
        statusCode: 201,
        accessToken: accessToken,
      };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new Error(`User registration failed: ${error.message || error}`);
    }
  }
}
