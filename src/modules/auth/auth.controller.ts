import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { RegisterDto } from './dto/register-dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin-dto';

// import { PostDto } from './dto/post.dto';
import { PostDocument } from './model/post.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/')
  index() {
    return 'hello';
  }
  @Post('/register')
  async create(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }
  @Post('/signin')
  async signin(@Body() signin: SigninDto) {
    return this.authService.signin(signin);
  }
  // @Get('fake')
  // async getFakeUsers(@Query('count') count: number) {
  //   return this.authService.createFakeUsers(Number(count) || 10);
  // }

  @Get('/recordsPost')
  async getRecordsPost(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ): Promise<{ records: PostDocument[]; totalPage: number }> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Invalid page or limit');
    }
    return this.authService.getRecordsPosts({ page, limit });
  }

  // @Post('post')
  // async createNewPost(@Body() postDto: PostDto) {
  //   return this.authService.createPost(postDto);
  // }
}
