import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { RoomFile } from '../roomFile/roomFile.entity'
import { User } from '../user/user.entity'
import { Room } from '../room/room.entity'

@Entity({ name: 'RoomMessages' })
export class RoomMessage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @Column({ select: false })
    userId: number

    @Column()
    roomId: number

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @ManyToOne(() => Room, (room) => room.messages)
    room: Room

    @OneToMany(() => RoomFile, (roomFile) => roomFile.message)
    files: RoomFile[]
}
