import {
    Column,
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

    @ManyToOne(() => Chat, (chat) => chat.messages)
    @JoinColumn()
    chat: Chat

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn()
    user: User

    @Column()
    userId: number

    @Column()
    chatId: number
}
