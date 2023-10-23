import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from 'src/validators';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(userId: number, data: CreateMessageDto) {
    const isAllowed = await this.prisma.room.findUnique({
      where: {
        id: data.roomId,
        participants: {
          some: {
            id: userId
          }
        }
      }
    });

    if (!isAllowed) {
      throw new ForbiddenException('You are not allowed in this room');
    }

    return this.prisma.message.create({
      data: {
        senderId: userId,
        roomId: data.roomId,
        content: data.message
      }
    });
  }
}
