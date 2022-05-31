import {
    Column, CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { Message } from '../message/message.entity'

@Entity('Chat')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ select: false })
    user1Id: number

    @Column({ select: false })
    user2Id: number

    @CreateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.chats)
    user1: User

    @ManyToOne(() => User, (user) => user.chats)
    user2: User

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[]
}
