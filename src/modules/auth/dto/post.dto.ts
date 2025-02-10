import { IsString, IsNotEmpty } from 'class-validator';
export class PostDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  img: string;

  @IsString()
  @IsNotEmpty({ message: 'Email không được để trống' })
  title: string;

  @IsString()
  description: string;
}
