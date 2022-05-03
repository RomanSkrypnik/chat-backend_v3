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

    async getAll(user1Id: number, user2Id: number) {
        const { id } = await this.chatService.getOrCreate(user1Id, user2Id)

        return await this.messageRepository.find({ where: { chatId: id } })
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
