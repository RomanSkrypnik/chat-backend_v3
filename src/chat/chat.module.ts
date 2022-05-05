import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { ChatService } from './chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { ChatController } from './chat.controller'
import MessageModule from '../message/message.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
        UserModule,
        forwardRef(() => MessageModule),
    ],
    controllers: [ChatController],
    exports: [ChatService],
    providers: [ChatService],
})
export default class ChatModule {}
