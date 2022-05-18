import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chat } from '../chat/chat.entity'
import { User } from '../user/user.entity'

@Entity('Blocked')
export class Blocked {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chatId: number

    @Column()
    blockerId: number

    @ManyToOne(() => Chat, (chat) => chat.id)
    chat: Chat

    @ManyToOne(() => User, (user) => user.id)
    blocker: User
}
