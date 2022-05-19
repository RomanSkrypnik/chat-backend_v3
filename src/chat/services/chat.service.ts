import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from '../chat.entity'
import { ILike, Repository } from 'typeorm'
import { UserService } from '../../user/user.service'
import { MessageService } from '../../message/message.service'
import { Message } from '../../message/message.entity'
import { BlockedService } from '../../blocked/blocked.service'
import { MutedService } from '../../muted/muted.service'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @Inject(forwardRef(() => MessageService))
        private messageService: MessageService,
        @Inject(forwardRef(() => BlockedService))
        private blockedService: BlockedService,
        @Inject(forwardRef(() => MutedService))
        private mutedService: MutedService,
        private userService: UserService
    ) {}

    async getChats(userId: number) {
        const user = await this.userService.getByColumn(userId, 'id')

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const chats = await this.getAll(userId)

        return this.getFormattedChats(chats, userId)
    }

    async getChat(userId: number, userHash: string) {
        const user = await this.userService.getByColumn(userHash, 'hash')

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        const { user1, user2, ...chat } = await this.getOne(userId, user.id)

        const messages = await this.messageService.get(chat.id, 0, 40)
        const isBlockedByMe = !!(await this.blockedService.getOne(
            chat.id,
            userId
        ))
        const isBlockedMyCompanion = !!(await this.blockedService.getOne(
            chat.id,
            user.id
        ))
        const isMutedByMe = !!(await this.mutedService.getOne(chat.id, userId))
        const isMutedByCompanion = !!(await this.mutedService.getOne(
            chat.id,
            user.id
        ))

        if (!chat) {
            return { messages: [], user }
        }

        return {
            ...chat,
            user,
            messages,
            isBlockedByMe,
            isBlockedMyCompanion,
            isMutedByMe,
            isMutedByCompanion,
        }
    }

    async getOne(user1Id: number, user2Id: number): Promise<Chat> {
        const condition = this.getCondition(user1Id, user2Id)

        return await this.chatRepository.findOne({
            where: condition,
            relations: ['user1', 'user2'],
        })
    }

    async getByColumn(item: string | number, column: string) {
        return await this.chatRepository.findOne({
            [column]: item,
            relations: ['user1', 'user2'],
        })
    }

    async getOrCreate(user1Id: number, user2Id: number): Promise<Chat> {
        const condition = this.getCondition(user1Id, user2Id)

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

        return this.getFormattedChats(chats, userId)
    }

    async getAll(userId: number): Promise<Chat[]> {
        return await this.chatRepository.find({
            where: [{ user1Id: userId }, { user2Id: userId }],
            relations: ['user1', 'user2'],
        })
    }

    private getFormattedChats(chats: Chat[], userId: number) {
        return Promise.all(
            chats.map(async ({ user1, user2, ...chat }) => {
                const messages = await this.messageService.get(chat.id, 0, 40)
                const user = user1.id === userId ? user2 : user1
                const isBlockedByMe = !!(await this.blockedService.getOne(
                    chat.id,
                    userId
                ))
                const isBlockedByCompanion =
                    !!(await this.blockedService.getOne(chat.id, user.id))
                const isMutedByMe = !!(await this.mutedService.getOne(
                    chat.id,
                    userId
                ))
                const isMutedByCompanion = !!(await this.mutedService.getOne(
                    chat.id,
                    user.id
                ))

                return {
                    ...chat,
                    messages,
                    user,
                    isBlockedByMe,
                    isBlockedByCompanion,
                    isMutedByMe,
                    isMutedByCompanion,
                }
            })
        )
    }

    private getCondition(user1Id: number, user2Id: number) {
        return [
            { user1Id, user2Id },
            { user1Id: user2Id, user2Id: user1Id },
        ]
    }
}
