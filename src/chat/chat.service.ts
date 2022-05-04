import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>
    ) {}

    async getAll(userId: number): Promise<Chat[]> {
        return await this.chatRepository.find({
            where: [{ user1Id: userId }, { user2Id: userId }],
            select: ['id'],
            relations: ['user1', 'user2', 'messages', 'messages.user'],
        })
    }

    async getOne(user1Id: number, user2Id: number): Promise<Chat> {
        const condition = this._getCondition(user1Id, user2Id)

        return await this.chatRepository.findOne({
            where: condition,
            select: ['id'],
            relations: ['messages', 'messages.user'],
        })
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

    _getCondition(user1Id: number, user2Id: number) {
        return [
            { user1Id, user2Id },
            { user1Id: user2Id, user2Id: user1Id },
        ]
    }
}
