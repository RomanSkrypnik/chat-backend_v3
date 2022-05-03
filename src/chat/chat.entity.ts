import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'

@Entity('Chat')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User)
    @JoinColumn()
    user1: User

    @OneToOne(() => User)
    @JoinColumn()
    user2: User

    @Column()
    user1Id: number

    @Column()
    user2Id: number
}
