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
        private chatService: ChatService,
        private userService: UserService,
    ) {}

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

    convertTwoDimArr(messages: Message[]) {
        const arr = []
        let i = 0

        messages.forEach((message, idx) => {
            if (idx > 0 && message.user.id !== messages[idx - 1].user.id) {
                i++
            }
            arr[i] = arr[i] ? [...arr[i], message] : [message]
        })

        return arr
    }
}
