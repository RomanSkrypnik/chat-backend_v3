import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { BlockedService } from './blocked.service'
import { UserModule } from '../user/user.module'
import { Blocked } from './blocked.entity'
import ChatModule from '../chat/chat.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Blocked]),
        UserModule,
        forwardRef(() => ChatModule),
    ],
    exports: [BlockedService],
    providers: [BlockedService],
})
export default class BlockedModule {}
