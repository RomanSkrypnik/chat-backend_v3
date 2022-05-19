import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Muted } from './muted.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { ChatService } from '../chat/services/chat.service'

@Injectable()
export class MutedService {
    constructor(
        @InjectRepository(Muted) private mutedRepository: Repository<Muted>,
        private userService: UserService,
        @Inject(forwardRef(() => ChatService))
        private chatService: ChatService
    ) {}

    async muteUnmute(muterId: number, mutedId: number) {
        const user = await this.userService.getByColumn(mutedId, 'id')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const chat = await this.chatService.getOne(mutedId, muterId)

        if (!chat) {
            throw new HttpException('Chat not found', HttpStatus.BAD_REQUEST)
        }

        const mutedRelation = await this.getOne(chat.id, muterId)

        if (mutedRelation) {
            await this.mutedRepository.delete(mutedRelation.id)
        } else {
            await this.mutedRepository.save({ muterId, chatId: chat.id })
        }

        return await this.chatService.getChat(muterId, user.hash)
    }

    async getOne(chatId: number, muterId: number): Promise<Muted> {
        return await this.mutedRepository.findOne({ chatId, muterId })
    }
}
