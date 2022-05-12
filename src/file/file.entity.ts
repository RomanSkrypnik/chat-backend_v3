import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Message } from '../message/message.entity'

@Entity('File')
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    filename: string

    @Column()
    ext: string

    @Column()
    messageId: number

    @ManyToOne(() => Message, (message) => message.files)
    message: Message
}
