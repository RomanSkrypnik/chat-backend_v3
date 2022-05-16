import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { ChatService } from './services/chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { ChatController } from './chat.controller'
import MessageModule from '../message/message.module'
import { ChatGateway } from './chat.gateway'
import { SocketService } from './services/socket.service'
import { Message } from '../message/message.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, Message]),
        UserModule,
        forwardRef(() => MessageModule),
    ],
    exports: [ChatService, ChatGateway],
    controllers: [ChatController],
    providers: [ChatService, SocketService, ChatGateway],
})
export default class ChatModule {}
