import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from './room.entity'
import { RoomService } from './room.service'
import { RoomController } from './room.controller'
import { UserModule } from '../user/user.module'
import RoomMessageModule from '../roomMessage/roomMessage.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Request } from 'express'
import { RoomGateway } from './room.gateway'

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        MulterModule.register({
            storage: diskStorage({
                destination: './public/room/avatar',
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
        UserModule,
        forwardRef(() => RoomMessageModule),
    ],
    exports: [RoomService],
    controllers: [RoomController],
    providers: [RoomService, RoomGateway],
})
export default class RoomModule {}
