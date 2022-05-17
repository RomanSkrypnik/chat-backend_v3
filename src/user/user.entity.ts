import {
    BeforeInsert,
    Column, CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Message } from '../message/message.entity'
import { Chat } from '../chat/chat.entity'
import * as bcrypt from 'bcrypt'

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

    @Column({ select: false })
    password: string

    @Column({ unique: true })
    hash: string

    @Column({ nullable: true })
    avatar: string

    @Column({ default: false, select: false })
    activated: boolean

    @Column({ default: false })
    online: boolean

    @CreateDateColumn()
    lastSeen: Date

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[]

    @OneToMany(() => Chat, (chat) => chat.user1 && chat.user2)
    chats: Chat[]

    @BeforeInsert()
    async setPassword() {
        const salt = await bcrypt.genSalt(6)
        this.password = await bcrypt.hash(this.password, salt)
    }
}
