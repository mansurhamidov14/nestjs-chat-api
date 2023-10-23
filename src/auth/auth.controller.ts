import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from 'src/validators';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() data: SignInDto) {
    return this.authService.singIn(data);
  }

  @Post('signup')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }
}
