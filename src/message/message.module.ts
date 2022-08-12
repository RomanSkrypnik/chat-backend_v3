import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { UserModule } from '../user/user.module';
import ChatModule from '../chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageController } from './message.controller';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';
import { File } from '../file/file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { ChatService } from '../chat/services/chat.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, File]),
        MulterModule.register({
            storage: diskStorage({
                destination: './public/chat/',
                filename(
                    req: Request,
                    file: Express.Multer.File,
                    callback: (error: Error | null, filename: string) => void,
                ) {
                    // TODO :: CREATE HELPER
                    const filenameSplit = file.originalname.split('.');
                    const ext = filenameSplit[filenameSplit.length - 1];
                    callback(null, `${Date.now()}.${ext}`);
                },
            }),
        }),
        UserModule,
        ChatModule,
        FileModule,
    ],
    exports: [MessageService],
    controllers: [MessageController],
    providers: [MessageService, FileService],
})
export default class MessageModule {}
