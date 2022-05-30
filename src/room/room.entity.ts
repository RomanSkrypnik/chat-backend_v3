import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { RoomMessage } from '../roomMessage/roomMessage.entity'

@Entity('Room')
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ type: 'text' })
    description: string

    @Column({ nullable: true })
    avatar: string

    @Column()
    hash: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => RoomMessage, (roomMessage) => roomMessage.room)
    messages: RoomMessage[]

    @ManyToMany(() => User, (user) => user.hostRooms)
    @JoinTable({
        name: 'room_host',
    })
    hosts: User[]

    @ManyToMany(() => User, (user) => user.rooms)
    @JoinTable({
        name: 'room_user',
    })
    users: User[]
}
