import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Module({
    imports: [TypeOrmModule.forRoot(), AuthModule],
})
export class AppModule {
    constructor(private connection: Connection) {}
}
