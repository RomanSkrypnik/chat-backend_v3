import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { RoomService } from '../room/room.service'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomMessage } from './roomMessage.entity'
import { Repository } from 'typeorm'
import { CreateRoomMessageDto } from './dtos'

@Injectable()
export class RoomMessageService {
    constructor(
        @InjectRepository(RoomMessage)
        private roomMessageRepository: Repository<RoomMessage>,
        @Inject(forwardRef(() => RoomService))
        private roomService: RoomService
    ) {}

    async get(
        roomId: number,
        take: number,
        skip: number
    ): Promise<RoomMessage[]> {
        return await this.roomMessageRepository.find({
            relations: ['user', 'files'],
            where: { roomId },
            take,
            skip,
        })
    }

    async getByColumn(
        item: string | number,
        column: string
    ): Promise<RoomMessage> {
        return await this.roomMessageRepository.findOne({
            where: { [column]: item },
            relations: ['user', 'files'],
        })
    }

    async create(
        { roomId, text }: CreateRoomMessageDto,
        userId: number
    ): Promise<RoomMessage> {
        const room = await this.roomService.getByColumn(roomId, 'id')

        if (!room) {
            throw new HttpException('Room not found', HttpStatus.BAD_REQUEST)
        }

        return await this.roomMessageRepository.save({
            userId,
            text,
            roomId: room.id,
        })
    }
}
