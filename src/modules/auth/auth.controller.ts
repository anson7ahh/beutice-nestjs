import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register-dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin-dto';
// import { SigninDto } from './dto/signin-dto';

@Controller()
export class AuthController {
  constructor(private readonly userService: AuthService) {}
  @Get('/register')
  index() {
    return 'hello';
  }
  @Post('/register')
  async create(@Body() register: RegisterDto) {
    // Validation sẽ được thực hiện tự động khi sử dụng DTO
    return this.userService.register(register);
  }
  @Post('/signin')
  async signin(@Body() signin: SigninDto) {
    return this.userService.signin(signin);
  }
}
