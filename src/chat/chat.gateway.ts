import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { MessageService } from '../message/message.service'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Server } from 'socket.io'
import { SocketDto, SocketReadMessage, SocketSendMessage } from './dtos'
import { SocketService } from './services/socket.service'
import * as jwt from 'jsonwebtoken'
import { UserDto } from '../user/dtos'
import { UserService } from '../user/user.service'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(
        private messageService: MessageService,
        private socketService: SocketService,
        private userService: UserService,
    ) {
    }

    async handleConnection(client: SocketDto, ...args: any[]) {
        const bearerToken = client.handshake.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(
                bearerToken,
                process.env.JWT_ACCESS_SECRET,
            ) as UserDto

            const user = await this.userService.getByColumn(decoded.id, 'id')

            if (!user) {
                throw new HttpException(
                    'User not found',
                    HttpStatus.BAD_REQUEST,
                )
            }

            client.user = decoded

            await this.broadcast('login', user, client)
            console.log('connection')
        } catch (ex) {
            client.disconnect()
        }
    }

    async handleDisconnect(client: SocketDto) {
        const lastSeen = new Date()

        await this.userService.update(client.user.id, {
            lastSeen,
            online: false,
        })

        await this.broadcast(
            'logout',
            { ...client.user, lastSeen, online: false },
            client
        )

        console.log('disconnect')
    }

    private async broadcast(event, message: any, client: SocketDto) {
        for (const socket of await this.server.fetchSockets()) {
            if (socket.id !== client.id) {
                socket.emit(event, message)
            }
        }
    }

    @SubscribeMessage('send-message')
    async handleSendMessage(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() { message, hash }: SocketSendMessage,
    ) {
        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(sockets, hash)

        client.emit('chat-message', message)

        if (companionSocket) {
            this.server.to(companionSocket.id).emit('chat-message', message)
        }
    }

    @SubscribeMessage('read-message')
    async handleReadMessage(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() { userId, messageId }: SocketReadMessage,
    ) {
        const message = await this.messageService.read(messageId, userId)

        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(
            sockets,
            message.user.hash,
        )

        client.emit('read-message', message)

        if (companionSocket) {
            this.server.to(companionSocket.id).emit('read-message', message)
        }
    }
}
