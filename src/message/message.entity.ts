import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Chat } from '../chat/chat.entity'
import { User } from '../user/user.entity'

@Entity('Message')
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @Column({ select: false })
    userId: number

    @Column({ select: false })
    chatId: number

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Chat, (chat) => chat.messages)
    @JoinColumn()
    chat: Chat

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn()
    user: User
}
