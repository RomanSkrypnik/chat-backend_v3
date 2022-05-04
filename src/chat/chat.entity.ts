import {
    Column,
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

    @Column()
    user1Id: number

    @Column()
    user2Id: number

    @ManyToOne(() => User, (user) => user.chats)
    user1: number

    @ManyToOne(() => User, (user) => user.chats)
    user2: number

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[]
}
