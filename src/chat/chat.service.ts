import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        private userService: UserService,
    ) {}

    async getOrCreate(user1Id: number, user2Id: number) {
        let chat = await this.chatRepository.findOne({
            where: [
                { user1Id, user2Id },
                { user1Id: user2Id, user2Id: user1Id },
            ],
        })

        if (!chat) {
            chat = await this.chatRepository.save({ user1Id, user2Id })
        }

        return chat
    }
}
