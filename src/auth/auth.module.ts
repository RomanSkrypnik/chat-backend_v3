import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { AuthGuard } from './auth.guard'
import { TokenService } from '../token/token.service'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [TypeOrmModule],
    controllers: [AuthController],
    providers: [AuthService, TokenService, AuthGuard],
})
export class AuthModule {}
