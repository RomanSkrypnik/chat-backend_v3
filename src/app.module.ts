import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import config from './ormconfig'
import { ConfigModule } from '@nestjs/config'
import MessageModule from './message/message.module'
import { FileModule } from './file/file.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        AuthModule,
        MessageModule,
        FileModule,
    ],
})
export class AppModule {
    constructor(private connection: Connection) {}
}
