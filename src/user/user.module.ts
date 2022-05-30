import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Request } from 'express'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MulterModule.register({
            storage: diskStorage({
                destination: './public/avatars/',
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
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
