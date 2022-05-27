import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn, Table,
} from 'typeorm'
import { Message } from '../message/message.entity'
import { Chat } from '../chat/chat.entity'
import * as bcrypt from 'bcrypt'
import { Room } from '../room/room.entity'

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    name: string

    @Column()
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

    @ManyToMany(() => Room, (room) => room.users)
    rooms: Room[]

    @ManyToMany(() => Room, (room) => room.hosts)
    hostRooms: Room[]

    @BeforeInsert()
    @BeforeUpdate()
    async setPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(6)
            this.password = await bcrypt.hash(this.password, salt)
        }
    }
}
