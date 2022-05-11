import { RemoteSocket } from 'socket.io/dist/broadcast-operator'
import { UserDto } from '../../user/dtos'

export interface SocketDto extends RemoteSocket<any, any> {
    user: UserDto
}
