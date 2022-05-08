import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { ILike, Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { MessageService } from '../message/message.service'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        @Inject(forwardRef(() => MessageService))
        private messageService: MessageService,
        private userService: UserService
    ) {}

    async getChats(userId: number) {
        const user = await this.userService.getByColumn(userId, 'id')

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const chats = await this._getAll(userId)

        return this._getFormattedChats(chats, userId)
    }

    async getChat(user1Id: number, userHash: string) {
        const user = await this.userService.getByColumn(userHash, 'hash')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const chat = await this._getOne(user1Id, user.id)

        if (!chat) {
            return { messages: [], user }
        }

        delete chat.user1
        delete chat.user2

        return { ...chat, user }
    }

    async getOrCreate(user1Id: number, user2Id: number): Promise<Chat> {
        const condition = this._getCondition(user1Id, user2Id)

        let chat = await this.chatRepository.findOne({
            where: condition,
        })

        if (!chat) {
            chat = await this.chatRepository.save({ user1Id, user2Id })
        }

        return chat
    }

    async getChatBySearch(userId: number, search: string): Promise<Chat[]> {
        const column = search.startsWith('@') ? 'username' : 'name'

        const chats = await this.chatRepository.find({
            where: [
                { user1: { [column]: ILike(`%${search}%`) } },
                { user2: { [column]: ILike(`%${search}%`) } },
            ],
            select: ['id'],
            relations: ['user1', 'user2', 'messages', 'messages.user'],
        })

        return this._getFormattedChats(chats, userId)
    }

    async _getAll(userId: number): Promise<Chat[]> {
        return await this.chatRepository.find({
            where: [{ user1Id: userId }, { user2Id: userId }],
            select: ['id'],
            relations: ['user1', 'user2', 'messages', 'messages.user'],
        })
    }

    async _getOne(user1Id: number, user2Id: number): Promise<Chat> {
        const condition = this._getCondition(user1Id, user2Id)

        return await this.chatRepository.findOne({
            where: condition,
            select: ['id'],
            relations: ['user1', 'user2', 'messages', 'messages.user'],
        })
    }

    _getFormattedChats(chats: Chat[], userId: number) {
        return chats.map((chat) => {
            const user = chat.user1.id === userId ? chat.user2 : chat.user1

            delete chat.user1
            delete chat.user2

            return { ...chat, user }
        })
    }

    _getCondition(user1Id: number, user2Id: number) {
        return [
            { user1Id, user2Id },
            { user1Id: user2Id, user2Id: user1Id },
        ]
    }
}
