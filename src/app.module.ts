import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import config from './ormconfig'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        AuthModule,
    ],
})
export class AppModule {
    constructor(private connection: Connection) {}
}
