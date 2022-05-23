import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { User } from '../user/decorators/user.decorator'
import { MessageService } from './message.service'
import { CreateMessageDto } from './dtos/create.dto'
import { AtGuard } from '../auth/guards/at.guard'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FileService } from '../file/file.service'
import { MessageQueryDto } from './dtos/messageQuery.dto'
import { Request, Response } from 'express'

@Controller('message')
export class MessageController {
    constructor(
        private messageService: MessageService,
        private fileService: FileService
    ) {}

    @Get('read/:id')
    @UseGuards(AtGuard)
    async read(
        @User('id') userId: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { id } = req.params
        const data = await this.messageService.read(+id, userId)
        res.status(HttpStatus.OK).json({ data })
    }

    @Get(':id')
    @UseGuards(AtGuard)
    async messages(
        @Query() query: MessageQueryDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let skip = +query.skip
        const take = +query.take
        const id = +req.params.id

        const messages = await this.messageService.get(id, skip, take)
        let isLoaded = false
        skip += 40

        if (messages.length < 40) {
            isLoaded = true
        }

        const data = { messages, skip, isLoaded }

        res.status(HttpStatus.OK).json({ data })
    }

    @Post('create')
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AtGuard)
    async create(
        @User('id') userId: number,
        @UploadedFiles() uploadedFiles: Array<Express.Multer.File>,
        @Body() body: CreateMessageDto,
        @Res() res: Response
    ) {
        // TODO :: Make code better
        if (!body.text && uploadedFiles.length === 0) {
            throw new HttpException(
                'Files and given text are empty',
                HttpStatus.BAD_REQUEST
            )
        }

        const message = await this.messageService.create(body, userId)

        await this.fileService.createBulk(uploadedFiles, message.id)

        const data = await this.messageService.getByColumn(message.id, 'id')
        res.status(HttpStatus.OK).json({ data })
    }
}
