import { MessageDto } from '../../message/dtos/message.dto'

export interface RoomSendMessage {
    message: MessageDto
    hash: string
    roomId: number
}

export interface RoomReadMessage {
    userId: number
    messageId: number
    roomId: number
}
