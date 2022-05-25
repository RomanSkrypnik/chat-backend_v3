import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomMessage } from './roomMessage.entity'
import RoomModule from '../room/room.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Request } from 'express'
import RoomFileModule from '../roomFile/roomFile.module'
import { Room } from '../room/room.entity'
import { RoomMessageController } from './roomMessage.controller'
import { RoomMessageService } from './roomMessage.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Room, RoomMessage]),
        MulterModule.register({
            storage: diskStorage({
                destination: './public/room/message',
                filename(
                    req: Request,
                    file: Express.Multer.File,
                    callback: (error: Error | null, filename: string) => void
                ) {
                    // TODO :: CREATE HELPER
                    const filenameSplit = file.originalname.split('.')
                    const ext = filenameSplit[filenameSplit.length - 1]
                    callback(null, `${Date.now()}.${ext}`)
                },
            }),
        }),
        RoomFileModule,
        forwardRef(() => RoomModule),
    ],
    exports: [RoomMessageService],
    controllers: [RoomMessageController],
    providers: [RoomMessageService],
})
export default class RoomMessageModule {}
