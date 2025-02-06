import { Exclude } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @MinLength(2, { message: 'Tên người dùng phải có ít nhất 2 ký tự' })
  fullName: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @Exclude() // Loại bỏ password khỏi response vì lý do bảo mật
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
