import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Muted } from './muted.entity'
import ChatModule from '../chat/chat.module'
import { MutedService } from './muted.service'
import { UserModule } from '../user/user.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Muted]),
        forwardRef(() => ChatModule),
        UserModule,
    ],
    exports: [MutedService],
    providers: [MutedService],
})
export default class MutedModule {}
