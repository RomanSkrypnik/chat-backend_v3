import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Blocked } from './blocked.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { ChatService } from '../chat/services/chat.service'

@Injectable()
export class BlockedService {
    constructor(
        @InjectRepository(Blocked)
        private blockedRepository: Repository<Blocked>,
        private userService: UserService,
        @Inject(forwardRef(() => ChatService))
        private chatService: ChatService
    ) {}

    async createOrDelete(blockerId: number, blockedId: number) {
        const user = await this.userService.getByColumn(blockedId, 'id')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const chat = await this.chatService.getOne(blockerId, blockedId)

        if (!chat) {
            throw new HttpException('Chat not found', HttpStatus.BAD_REQUEST)
        }

        const blockedRelation = await this.getOne(chat.id, blockerId)

        if (blockedRelation) {
            await this.blockedRepository.delete(blockedRelation.id)
        } else {
            await this.blockedRepository.save({ blockerId, chatId: chat.id })
        }

        return await this.chatService.getChat(blockerId, user.hash)
    }

    async getOne(chatId: number, blockerId: number) {
        return await this.blockedRepository.findOne({ chatId, blockerId })
    }
}
