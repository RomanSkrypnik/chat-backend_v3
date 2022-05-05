import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { Repository } from 'typeorm'
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
        const currUser = await this.userService.getByColumn(userId, 'id')

        if (!currUser) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const chats = await this._getAll(userId)

        return chats.map((chat) => {
            const messages = this.messageService.convertTwoDimArr(chat.messages)

            const user = chat.user1.id === currUser.id ? chat.user2 : chat.user1

            delete chat.user1
            delete chat.user2

            return { ...chat, messages, user }
        })
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

        const messages = this.messageService.convertTwoDimArr(chat.messages)

        delete chat.user1
        delete chat.user2

        return { ...chat, messages, user }
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

    _getCondition(user1Id: number, user2Id: number) {
        return [
            { user1Id, user2Id },
            { user1Id: user2Id, user2Id: user1Id },
        ]
    }
}
