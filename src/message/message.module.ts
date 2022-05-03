import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { UserModule } from '../user/user.module'
import ChatModule from '../chat/chat.module'

@Module({
    imports: [UserModule, ChatModule],
    providers: [MessageService],
})
export default class MessageModule {}
