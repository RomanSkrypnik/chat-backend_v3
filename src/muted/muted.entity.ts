import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chat } from '../chat/chat.entity'
import { User } from '../user/user.entity'

@Entity('Muted')
export class Muted {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chatId: number

    @Column()
    muterId: number

    @ManyToOne(() => Chat, (chat) => chat.id)
    chat: Chat

    @ManyToOne(() => User, (user) => user.id)
    muter: User
}
