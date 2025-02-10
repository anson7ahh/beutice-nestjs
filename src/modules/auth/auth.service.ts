import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
// import { faker } from '@faker-js/faker';
import { RegisterDto } from './dto/register-dto';
import { SigninDto } from './dto/signin-dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { User } from './model/user.model';
// import { PostDto } from './dto/post.dto';
import { PostDocument } from './model/post.model';

@Injectable()
export class AuthService {
  constructor(
    private auhtRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      // Check if the user already exists
      const existingUser = await this.auhtRepository.findByEmail(
        registerDto.email,
      );
      if (existingUser) {
        return {
          message: 'Account already exists',
          statusCode: 400,
        };
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);

      const newUser = await this.auhtRepository.createUser({
        ...registerDto,
        password: hashedPassword,
      });
      if (!newUser) {
        return { message: 'create false', statusCode: 400 };
      }
      return {
        message: 'User registered successfully',
        statusCode: 201,
      };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new Error(`User registration failed: ${error.message || error}`);
    }
  }
  async signin(signinDto: SigninDto): Promise<{
    message: string;
    statusCode: number;
    token?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  }> {
    try {
      console.log(1);
      const existingUser = await this.auhtRepository.findByEmail(
        signinDto.email,
      );

      console.log('existingUser', existingUser);
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
        token: accessToken,
        fullName: existingUser.fullName,
        phoneNumber: existingUser.phoneNumber,
        email: existingUser.email,
      };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new Error(`User registration failed: ${error.message || error}`);
    }
  }

  // async createFakeUsers(count: number) {
  //   const users = [];

  //   for (let i = 0; i < count; i++) {
  //     users.push({
  //       id: faker.string.uuid(),
  //       fullName: faker.person.fullName(),
  //       password: faker.internet.password(),
  //       email: faker.internet.email(),
  //       phoneNumber: faker.phone.number({ style: 'international' }),
  //     });
  //   }
  //   await this.auhtRepository.saveUsers(users);
  //   return { message: `Đã tạo ${count} user mẫu`, statusCode: 201 };
  // }

  async getRecords({
    page = 1,
    limit = 3,
  }): Promise<{ records: User[]; totalPage: number }> {
    const offset = (page - 1) * limit;

    const totalRecords = await this.auhtRepository.countDocuments();

    const totalPage = Math.ceil(totalRecords / limit);

    const records = await this.auhtRepository.find({ limit, offset });
    return { records, totalPage };
  }

  // async createPost(
  //   postDto: PostDto,
  // ): Promise<{ message: string; statusCode: number }> {
  //   try {
  //     const newPost = await this.auhtRepository.createPost(postDto);
  //     if (!newPost) {
  //       return { message: 'create false', statusCode: 400 };
  //     }
  //     return {
  //       message: 'Post created successfully',
  //       statusCode: 201,
  //     };
  //   } catch (error) {
  //     console.error('Error during user registration:', error);
  //     throw new Error(`User registration failed: ${error.message || error}`);
  //   }
  // }
  async getRecordsPosts({
    page = 1,
    limit = 3,
  }): Promise<{ records: PostDocument[]; totalPage: number }> {
    const offset = (page - 1) * limit;

    const totalRecords = await this.auhtRepository.countPost();

    const totalPage = Math.ceil(totalRecords / limit);

    const records = await this.auhtRepository.findPost({ limit, offset });
    return { records, totalPage };
  }
}
