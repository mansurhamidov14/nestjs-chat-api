import { Body, Controller, Post, UseGuards, ForbiddenException, Get } from '@nestjs/common';
import { JwtGuard } from 'src/auth/strategy';
import { User } from 'src/decorators';
import { CreateRoomDto } from 'src/validators';
import { RoomService } from './room.service';

@UseGuards(JwtGuard)
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post('new')
  createRoom(@User('sub') userId: number, @Body() data: CreateRoomDto) {
    if (!data.participants.includes(userId)) {
      throw new ForbiddenException();
    }

    return this.roomService.createRoom(data);
  }

  @Get('list')
  myRooms(@User('sub') userId: number) {
    return this.roomService.getUserRooms(userId);
  }
}
