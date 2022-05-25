import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RoomMessage } from '../roomMessage/roomMessage.entity'

@Entity('RoomFile')
export class RoomFile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    filename: string

    @Column()
    ext: string

    @Column()
    messageId: number

    @ManyToOne(() => RoomMessage, (roomMessage) => roomMessage.files)
    message: RoomMessage
}
