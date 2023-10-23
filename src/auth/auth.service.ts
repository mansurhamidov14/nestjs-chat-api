import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from 'src/validators';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) { }

  async signUp(data: SignUpDto) {
    const hash = await argon.hash(data.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: data.firstName,
          email: data.email,
          lastName: data.lastName,
          hash,
        }
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('This email is already taken');
      }

      throw error;
    }
  }

  async singIn(data: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isValidPassword = await argon.verify(user.hash, data.password);

    if (!isValidPassword) {
      throw new ForbiddenException('Invalid credentials');
    }

    const access_token = await this.signToken(user.id, user.email);
    return { access_token };
  }

  signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get('JWT_SECRET')
    });
  }
}
