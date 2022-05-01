import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

    @Column()
    password: string

    @Column({ nullable: true })
    avatar: string

    @Column({ default: false })
    activated: boolean
}
