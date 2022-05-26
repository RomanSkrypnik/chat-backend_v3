import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Room } from './room.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { RoomMessageService } from '../roomMessage/roomMessage.service'
import { randomBytes } from 'crypto'
import { CreateRoomDto } from './dtos/create.dto'

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room) private roomRepository: Repository<Room>,
        private userService: UserService,
        @Inject(forwardRef(() => RoomMessageService))
        private roomMessageService: RoomMessageService
    ) {}

    async getRooms(skip: number, take: number) {
        const rooms = await this.get(skip, take)

        return Promise.all(
            rooms.map(async (room) => await this.getFormattedRoom(room, 40, 0))
        )
    }

    async getRoom(hash: string) {
        const room = await this.getByColumn(hash, 'hash')

        if (!room) {
            throw new HttpException('Room not found', HttpStatus.BAD_REQUEST)
        }

        return this.getFormattedRoom(room, 40, 0)
    }

    async get(skip: number, take: number) {
        return await this.roomRepository.find({
            relations: ['hosts', 'users'],
            order: { createdAt: 'DESC' },
            take,
            skip,
        })
    }

    async getByColumn(item: number | string, column: string) {
        return await this.roomRepository.findOne({
            where: { [column]: item },
            relations: ['hosts', 'users', 'messages'],
        })
    }

    async create(userId: number, createDto: CreateRoomDto) {
        const user = await this.userService.getByColumn(userId, 'id')

        const room = new Room()

        room.hash = randomBytes(32).toString('hex')
        room.users = [user]
        room.hosts = [user]

        return await this.roomRepository.save({ ...createDto, ...room })
    }

    async addUserToRoom(userId: number, roomId: number) {
        const currUser = await this.userService.getByColumn(userId, 'id')

        if (!currUser) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const room = await this.getByColumn(roomId, 'id')

        if (!room) {
            throw new HttpException('Room not found', HttpStatus.BAD_REQUEST)
        }

        const foundUser = room.users.find((user) => user.id === currUser.id)

        if (!foundUser) {
            room.users = [...room.users, currUser]
        }

        return await this.roomRepository.save(room)
    }

    private async getFormattedRoom(room: Room, take: number, skip: number) {
        const messages = await this.roomMessageService.get(room.id, take, skip)

        return { ...room, messages }
    }
}
