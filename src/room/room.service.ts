import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from 'src/validators';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: CreateRoomDto) {
    const participants = await this.prisma.user.findMany({
      where: {
        id: {
          in: data.participants
        }
      }
    });
    return this.prisma.room.create({
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      data: {
        roomType: data.roomType,
        name: data.name,
        participants: {
          connect: participants
        }
      }
    });
  }

  getUserRooms(userId: number) {
    return this.prisma.room.findMany({
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        messages: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        }
      },
      where: {
        participants: {
          some: {
            id: userId
          }
        }
      }
    });
  }
}
