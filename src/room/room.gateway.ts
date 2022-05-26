import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import * as jwt from 'jsonwebtoken'
import { UserDto } from '../user/dtos'
import { HttpException, HttpStatus } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { SocketDto } from '../chat/dtos'
import { RoomService } from './room.service'
import { Server } from 'socket.io'
import { RoomMessageDto } from '../roomMessage/dtos/message.dto'

@WebSocketGateway({ cors: true, namespace: 'room' })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server

    constructor(
        private userService: UserService,
        private roomService: RoomService
    ) {}

    async handleConnection(client: any, ...args: any[]) {
        const bearerToken = client.handshake.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(
                bearerToken,
                process.env.JWT_ACCESS_SECRET
            ) as UserDto

            const user = await this.userService.getByColumn(decoded.id, 'id')

            if (!user) {
                throw new HttpException(
                    'User not found',
                    HttpStatus.BAD_REQUEST
                )
            }

            client.user = { ...decoded, online: true }

            console.log('room connection')
        } catch (ex) {
            client.disconnect()
        }
    }

    handleDisconnect(client: any): any {
        console.log('room disconnect')
    }

    @SubscribeMessage('join')
    async joinRoom(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() roomId: number
    ) {
        const { user } = client
        const roomStr = `${roomId}`

        await this.roomService.addUserToRoom(user.id, roomId)

        const data = { user, roomId }

        client.join(roomStr)
        this.server.to(roomStr).emit('join', data)
    }

    @SubscribeMessage('send-message')
    async sendRoomMessage(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() message: RoomMessageDto
    ) {
        this.server.to(`${message.roomId}`).emit('room-message', message)
    }
}
