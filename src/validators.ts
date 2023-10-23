import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export enum RoomType {
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;
}

export class SignInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class CreateRoomDto {
  @IsEnum(RoomType)
  roomType: RoomType;

  @IsOptional()
  @IsString()
  name: string;

  @IsNumber({}, { each: true })
  participants: number[];
}

export class CreateMessageDto {
  @IsNumber()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
