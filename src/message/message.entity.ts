import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Chat } from '../chat/chat.entity'
import { User } from '../user/user.entity'
import { File } from '../file/file.entity'

@Entity('Message', )
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    text: string

    @Column({ default: false })
    isRead: boolean

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

    @OneToMany(() => File, (file) => file.message)
    files: File[]
}
