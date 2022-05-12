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

    async create(
        { hash, text }: CreateMessageDto,
        userId: number
    ): Promise<Message> {
        const user = await this.userService.getByColumn(hash, 'hash')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const { id } = await this.chatService.getOrCreate(userId, user.id)

        return await this.messageRepository.save({
            text,
            chatId: id,
            userId,
        })
    }

    async getByColumn(item: any, column: string) {
        return await this.messageRepository.findOne({
            select: ['id', 'text', 'createdAt', 'files', 'user'],
            where: { [column]: item },
            relations: ['user', 'files'],
        })
    }
}
