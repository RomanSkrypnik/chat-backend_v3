import { RemoteSocket } from 'socket.io/dist/broadcast-operator'
import { UserDto } from '../../user/dtos'
import { MessageDto } from '../../message/dtos/message.dto'
import { ChatDto } from './chat.dto';

export interface SocketDto extends RemoteSocket<any, any> {
    user: UserDto
    roomId?: number
}

export interface SocketSendMessage {
    message: MessageDto
    hash: string
}

export interface SocketNewChat {
    chat: ChatDto;
    hash: string;
}

export interface SocketReadMessage {
    userId: number
    messageId: number
}
