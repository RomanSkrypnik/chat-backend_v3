import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'
import { AtStrategy, RtStrategy } from './strategies'

@Module({
    imports: [TokenModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService, RtStrategy, AtStrategy],
})
export class AuthModule {}
