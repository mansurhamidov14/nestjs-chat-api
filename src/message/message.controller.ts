import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/strategy';
import { MessageService } from './message.service';
import { CreateMessageDto } from 'src/validators';
import { User } from 'src/decorators';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('new')
  createMessage(@User('sub') userId: number, @Body() data: CreateMessageDto) {
    return this.messageService.saveMessage(userId, data);
  }
}
