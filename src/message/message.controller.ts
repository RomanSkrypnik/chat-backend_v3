import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { User } from '../user/decorators/user.decorator'
import { Response } from 'express'
import { MessageService } from './message.service'
import { CreateMessageDto } from './dtos/create.dto'
import { AtGuard } from '../auth/guards/at.guard'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FileService } from '../file/file.service'

@Controller('message')
export class MessageController {
    constructor(
        private messageService: MessageService,
        private fileService: FileService
    ) {}

    @Post('create')
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AtGuard)
    async create(
        @User('id') userId: number,
        @UploadedFiles() uploadedFiles: Array<Express.Multer.File>,
        @Body() body: CreateMessageDto,
        @Res() res: Response
    ) {
        const message = await this.messageService.create(body, userId)

        await this.fileService.createBulk(uploadedFiles, message.id)

        const data = await this.messageService.getByColumn(message.id, 'id')

        res.status(HttpStatus.OK).json({ data })
    }
}
