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
import { BlockedService } from '../blocked/blocked.service'
import { MutedService } from '../muted/muted.service'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server

    constructor(
        private messageService: MessageService,
        private socketService: SocketService,
        private userService: UserService,
        private blockedService: BlockedService,
        private mutedService: MutedService
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

            client.user = { ...decoded, online: true }

            const sockets = (await this.server.fetchSockets()) as SocketDto[]
            this.socketService.broadcast(sockets, 'login', user, client)

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

        const sockets = (await this.server.fetchSockets()) as SocketDto[]
        const user = { ...client.user, lastSeen, online: false }

        this.socketService.broadcast(sockets, 'logout', user, client)

        console.log('disconnect')
    }

    @SubscribeMessage('send-message')
    async handleSendMessage(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() { message, hash }: SocketSendMessage
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
        @MessageBody() { userId, messageId }: SocketReadMessage
    ) {
        const message = await this.messageService.read(messageId, userId)

        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(
            sockets,
            message.user.hash
        )

        client.emit('read-message', message)

        if (companionSocket) {
            this.server.to(companionSocket.id).emit('read-message', message)
        }
    }

    @SubscribeMessage('block-unblock')
    async handleBlockUnblock(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() blockedId: number
    ) {
        const chat = await this.blockedService.createOrDelete(
            client.user.id,
            blockedId
        )

        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(
            sockets,
            chat.user.hash
        )

        client.emit('block-unblock', chat)

        if (companionSocket) {
            this.server
                .to(companionSocket.id)
                .emit('block-unblock', { ...chat, user: client.user })
        }
    }

    @SubscribeMessage('mute-unmute')
    async handleMuteUnmute(
        @ConnectedSocket() client: SocketDto,
        @MessageBody() mutedId: number
    ) {
        const chat = await this.mutedService.muteUnmute(client.user.id, mutedId)

        const sockets = (await this.server.fetchSockets()) as SocketDto[]

        const companionSocket = this.socketService.getOne(
            sockets,
            chat.user.hash
        )

        client.emit('mute-unmute', chat)

        if (companionSocket) {
            this.server
                .to(companionSocket.id)
                .emit('mute-unmute', { ...chat, user: client.user })
        }
    }
}
