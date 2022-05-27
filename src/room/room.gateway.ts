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
import { RoomMessageService } from '../roomMessage/roomMessage.service'
import { RoomReadMessage } from './dtos'

@WebSocketGateway({ cors: true, namespace: 'room' })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server

    constructor(
        private userService: UserService,
        private roomService: RoomService,
        private roomMessageService: RoomMessageService
    ) {}

    async handleConnection(client: any, ...args: any[]) {
        const bearerToken = client.handshake.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(
                bearerToken,
                process.env.JWT_ACCESS_SECRET
            ) as UserDto

            const user = await this.userService.getOneWith(decoded.id, 'rooms')

            if (!user) {
                throw new HttpException(
                    'User not found',
                    HttpStatus.BAD_REQUEST
                )
            }
            const currUser = { ...decoded, online: true }

            client.user = currUser

            user.rooms.forEach(({ id }) => {
                this.server.to(`${id}`).emit('login', currUser)
            })

            console.log('room connection')
        } catch (ex) {
            console.log(ex)
            client.disconnect()
        }
    }

    handleDisconnect(client: SocketDto): any {
        const { roomId } = client

        if (roomId) {
            const user = { ...client.user, isInRoom: false }
            this.server.to(`${roomId}`).emit('leave', user)
        }

        console.log('room disconnect')
    }

    @SubscribeMessage('leave')
    async leave(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() roomId: number
    ) {
        const user = { ...client.user, isInRoom: false }
        this.server.to(`${roomId}`).emit('leave', { user, roomId })
        console.log('leave')
    }

    @SubscribeMessage('join')
    async joinRoom(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() roomId: number
    ) {
        const { user } = client
        const roomStr = `${roomId}`

        await this.roomService.addUserToRoom(user.id, roomId)

        const data = { user: { ...user, isInRoom: true }, roomId }

        client.roomId = roomId

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

    @SubscribeMessage('read-message')
    async handleReadMessage(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() { userId, messageId, roomId }: RoomReadMessage
    ) {
        const message = await this.roomMessageService.read(messageId, userId)
        this.server.to(`${roomId}`).emit('read-message', message)
    }
}
