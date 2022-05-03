import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { ChatService } from './chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from './chat.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Chat]), UserModule],
    exports: [ChatService],
    providers: [ChatService],
})
export default class ChatModule {}
