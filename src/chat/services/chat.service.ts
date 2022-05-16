import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from '../chat.entity'
import { getManager, ILike, Repository } from 'typeorm'
import { UserService } from '../../user/user.service'
import { MessageService } from '../../message/message.service'
import { Message } from '../../message/message.entity'
import { ChatDto } from '../dtos/chat.dto'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @Inject(forwardRef(() => MessageService))
        private messageService: MessageService,
        private userService: UserService
    ) {}

    async getChats(userId: number) {
        const user = await this.userService.getByColumn(userId, 'id')

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const chats = await this._getAll(userId)

        return this._getFormattedChats(chats, userId)
    }

    async getChat(userId: number, userHash: string) {
        const user = await this.userService.getByColumn(userHash, 'hash')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const { user1, user2, ...chat } = await this._getOne(userId, user.id)
        const messages = await this.messageService.get(chat.id, 0, 40)

        if (!chat) {
            return { messages: [], user }
        }

        return { ...chat, user, messages }
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

    async getChatBySearch(userId: number, search: string) {
        const column = search.startsWith('@') ? 'username' : 'name'

        const chats = await this.chatRepository.find({
            where: [
                { user1: { [column]: ILike(`${search}%`) } },
                { user2: { [column]: ILike(`${search}%`) } },
            ],
            select: ['id'],
            relations: ['user1', 'user2'],
        })

        return this._getFormattedChats(chats, userId)
    }

    async _getAll(userId: number): Promise<Chat[]> {
        return await this.chatRepository.find({
            where: [{ user1Id: userId }, { user2Id: userId }],
            relations: ['user1', 'user2'],
        })
    }

    async _getOne(user1Id: number, user2Id: number): Promise<Chat> {
        const condition = this._getCondition(user1Id, user2Id)

        return await this.chatRepository.findOne({
            where: condition,
            relations: ['user1', 'user2'],
        })
    }

    _getFormattedChats(chats: Chat[], userId: number) {
        return Promise.all(
            chats.map(async ({ user1, user2, ...chat }) => {
                const messages = await this.messageService.get(chat.id, 0, 40)
                const user = user1.id === userId ? user2 : user1
                return { ...chat, messages, user }
            })
        )
    }

    _getCondition(user1Id: number, user2Id: number) {
        return [
            { user1Id, user2Id },
            { user1Id: user2Id, user2Id: user1Id },
        ]
    }
}
