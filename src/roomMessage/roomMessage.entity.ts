import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { RoomFile } from '../roomFile/roomFile.entity'
import { User } from '../user/user.entity'
import { Room } from '../room/room.entity'

@Entity({ name: 'Room_Messages' })
export class RoomMessage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @Column({ default: false })
    isRead: boolean

    @Column({ select: false })
    userId: number

    @Column()
    roomId: number

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @ManyToOne(() => Room, (room) => room.messages)
    room: Room

    @OneToMany(() => RoomFile, (roomFile) => roomFile.message)
    files: RoomFile[]
}
