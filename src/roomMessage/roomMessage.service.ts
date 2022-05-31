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
            order: { createdAt: 'DESC' },
            take,
            skip,
        })
    }

    async getByColumn(
        item: string | number,
        column: string,
    ): Promise<RoomMessage> {
        return await this.roomMessageRepository.findOne({
            where: { [column]: item },
            relations: ['user', 'files'],
        })
    }

    async create(
        { roomId, text }: CreateRoomMessageDto,
        userId: number,
    ): Promise<RoomMessage> {
        const room = await this.roomService.getOneByColumn(roomId, 'id')

        if (!room) {
            throw new HttpException('Room not found', HttpStatus.BAD_REQUEST)
        }

        return await this.roomMessageRepository.save({
            userId,
            text,
            roomId: room.id,
        })
    }

    async read(messageId: number, userId: number) {
        const message = await this.getByColumn(messageId, 'id')

        if (!message) {
            throw new HttpException('Message not found', HttpStatus.BAD_REQUEST)
        }

        if (message.userId === userId) {
            throw new HttpException(
                'Sender cannot read its own message',
                HttpStatus.BAD_REQUEST,
            )
        }

        const { users } = await this.roomService.getOneByColumn(
            message.roomId,
            'id'
        )

        const userIdx = users.findIndex((user) => user.id === userId)

        if (userIdx !== -1) {
            await this.roomMessageRepository.save({
                id: messageId,
                isRead: true,
            })

            return { ...message, isRead: true }
        }

        throw new HttpException(
            'You cannot read this message',
            HttpStatus.BAD_REQUEST,
        )
    }
}
