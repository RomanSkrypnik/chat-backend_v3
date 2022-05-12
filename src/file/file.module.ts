import { Module } from '@nestjs/common'
import ChatModule from '../chat/chat.module'
import { FileService } from './file.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './file.entity'

@Module({
    imports: [TypeOrmModule.forFeature([File]), ChatModule],
    exports: [FileService],
    providers: [FileService],
})
export class FileModule {}
