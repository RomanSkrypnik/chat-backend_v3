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
import { SocketDto } from './dtos'
import { SocketService } from './services/socket.service'
import * as jwt from 'jsonwebtoken'
import { UserDto } from '../user/dtos'
import { UserService } from '../user/user.service'
import { MessageDto } from '../message/dtos/message.dto'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(
        private messageService: MessageService,
        private socketService: SocketService,
        private userService: UserService
    ) {}

    async handleConnection(client: SocketDto, ...args: any[]) {
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

            client.user = decoded

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
        @MessageBody() { message, hash }: { message: MessageDto; hash: string }
    ) {
        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(sockets, hash)

        client.emit('chat-message', message)

        if (companionSocket) {
            this.server.to(companionSocket.id).emit('chat-message', message)
        }
    }
}
