import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { UserModule } from '../user/user.module'
import ChatModule from '../chat/chat.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { MessageController } from './message.controller'

@Module({
    imports: [TypeOrmModule.forFeature([Message]), UserModule, ChatModule],
    exports: [MessageService],
    controllers: [MessageController],
    providers: [MessageService],
})
export default class MessageModule {}
