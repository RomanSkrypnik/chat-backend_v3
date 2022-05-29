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

            this.server.emit('login', currUser)
            console.log('room connection')
        } catch (ex) {
            console.log(ex)
            client.disconnect()
        }
    }

    async handleDisconnect(client: SocketDto): Promise<any> {
        const user = await this.userService.getByColumn(client.user.id, 'id')
        this.server.emit('logout', user)
        console.log('room disconnect')
    }

    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client: SocketDto) {
        const { rooms } = client

        const roomId = Array.from(rooms).pop()

        client.leave(roomId)

        const sockets = (await this.server
            .in(`${roomId}`)
            .fetchSockets()) as SocketDto[]

        const { users } = await this.roomService.getOneByColumn(roomId, 'id')

        const roomUsers = users.map((user) => {
            const isInRoom = sockets.some(
                (socket) => socket.user.id === user.id
            )
            return { ...user, isInRoom }
        })

        this.server.to(roomId).emit('leave', roomUsers)
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

        client.join(roomStr)

        const sockets = (await this.server
            .in(roomStr)
            .fetchSockets()) as SocketDto[]

        const { users } = await this.roomService.getOneByColumn(roomId, 'id')

        const roomUsers = users.map((user) => {
            const isInRoom = sockets.some(
                (socket) => socket.user.id === user.id
            )
            return { ...user, isInRoom }
        })

        this.server.to(roomStr).emit('join', roomUsers)
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
