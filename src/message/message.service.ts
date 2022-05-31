import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ChatService } from '../chat/services/chat.service'
import { CreateMessageDto } from './dtos/create.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private chatService: ChatService,
        private userService: UserService
    ) {}

    async read(id: number, userId: number) {
        const message = await this.getByColumn(id, 'id')

        if (!message) {
            throw new HttpException('Message not found', HttpStatus.BAD_REQUEST)
        }

        if (message.userId === userId) {
            throw new HttpException(
                'Sender cannot read its own message',
                HttpStatus.BAD_REQUEST
            )
        }

        const { user1, user2 } = await this.chatService.getByColumn(
            message.chatId,
            'id'
        )

        if (user1.id === userId || user2.id === userId) {
            await this.messageRepository.save({
                id,
                isRead: true,
            })

            return { ...message, isRead: true }
        }

        throw new HttpException(
            'You cannot read this message',
            HttpStatus.BAD_REQUEST
        )
    }

    async create(
        { hash, text }: CreateMessageDto,
        userId: number
    ): Promise<Message> {
        const user = await this.userService.getByColumn(hash, 'hash')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const chat = await this.chatService.getOrCreate(userId, user.id)

        const message = await this.messageRepository.save({
            text,
            chatId: chat.id,
            userId,
        })

        chat.updatedAt = new Date()
        await this.chatService.update(chat.id, chat)

        return message
    }

    async get(chatId: number, skip: number, take: number): Promise<Message[]> {
        return await this.messageRepository.find({
            select: ['id', 'text', 'createdAt', 'chatId', 'isRead'],
            relations: ['user', 'files'],
            where: { chatId },
            order: {
                createdAt: 'DESC',
            },
            skip,
            take,
        })
    }

    async getByColumn(item: string | number, column: string): Promise<Message> {
        return await this.messageRepository.findOne({
            select: [
                'id',
                'text',
                'createdAt',
                'files',
                'user',
                'chatId',
                'isRead',
            ],
            where: { [column]: item },
            relations: ['user', 'files'],
        })
    }
}
