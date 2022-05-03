import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chat } from '../chat/chat.entity'
import { User } from '../user/user.entity'

@Entity('Message')
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @OneToOne(() => Chat)
    @JoinColumn()
    chat: Chat

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}
