import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomFile } from './roomFile.entity'
import { RoomFileService } from './roomFile.service'

@Module({
    imports: [TypeOrmModule.forFeature([RoomFile])],
    exports: [RoomFileService],
    providers: [RoomFileService],
})
export default class RoomFileModule {}
