import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ChatService } from '../chat/chat.service'
import { CreateMessageDto } from './dtos/create.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private userService: UserService,
        private chatService: ChatService
    ) {}

    async getAll(user1Id: number) {
        const currUser = await this.userService.getByColumn(user1Id, 'id')

        if (!currUser) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const chats = await this.chatService.getAll(user1Id)

        return chats.map((chat) => {
            const user = chat.user1.id === currUser.id ? chat.user2 : chat.user1

            delete chat.user1
            delete chat.user2

            return { ...chat, user }
        })
    }

    async create(messageDto: CreateMessageDto, userId: number) {
        const user = await this.userService.getByColumn(messageDto.hash, 'hash')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const { id } = await this.chatService.getOrCreate(userId, user.id)

        return await this.messageRepository.save({
            text: messageDto.message.text,
            chatId: id,
            userId,
        })
    }
}
