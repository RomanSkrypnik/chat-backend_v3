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
import { CreateMessageDto } from '../message/dtos/create.dto'
import { UseGuards } from '@nestjs/common'
import { Server } from 'socket.io'
import { SocketDto } from './dtos'
import { SocketService } from './services/socket.service'
import * as jwt from 'jsonwebtoken'
import { UserDto } from '../user/dtos'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(
        private messageService: MessageService,
        private socketService: SocketService
    ) {}

    async handleConnection(client: SocketDto, ...args: any[]) {
        const bearerToken = client.handshake.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.verify(
                bearerToken,
                process.env.JWT_ACCESS_SECRET
            )

            client.user = decoded as UserDto
            console.log('connection')
        } catch (ex) {
            client.disconnect()
        }
    }

    async handleDisconnect(client: SocketDto) {
        console.log('disconnect')
    }

    @SubscribeMessage('send-message')
    async handleMessage(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() message: CreateMessageDto
    ) {
        const data = await this.messageService.create(message, client.user.id)

        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(sockets, message.hash)

        client.emit('chat-message', data)

        if (companionSocket) {
            this.server.to(companionSocket.id).emit('chat-message', data)
        }
    }
}
