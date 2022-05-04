import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Message } from '../message/message.entity'
import { Chat } from '../chat/chat.entity'

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ unique: true })
    hash: string

    @Column({ nullable: true })
    avatar: string

    @Column({ default: false })
    activated: boolean

    @Column({ default: false })
    online: boolean

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[]

    @OneToMany(() => Chat, (chat) => chat.user1 && chat.user2)
    chats: Chat[]
}
