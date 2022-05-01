import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import config from './ormconfig'

@Module({
    imports: [TypeOrmModule.forRoot(config), AuthModule],
})
export class AppModule {
    constructor(private connection: Connection) {}
}
