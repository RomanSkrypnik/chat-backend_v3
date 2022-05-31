import {
    Body,
    Controller, Get,
    HttpException,
    HttpStatus,
    Post, Query, Req,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { AtGuard } from '../auth/guards/at.guard'
import { User } from '../user/decorators/user.decorator'
import { Request, Response } from 'express'
import { RoomMessageService } from './roomMessage.service'
import { CreateRoomMessageDto } from './dtos'
import { RoomFileService } from '../roomFile/roomFile.service'
import { MessageQueryDto } from '../message/dtos/messageQuery.dto'

@Controller('room-message')
export class RoomMessageController {
    constructor(
        private roomMessageService: RoomMessageService,
        private roomFileService: RoomFileService
    ) {}

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

        const messages = await this.roomMessageService.get(id, skip, take)
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
        @Body() body: CreateRoomMessageDto,
        @Res() res: Response
    ) {
        // TODO :: Make code better
        if (!body.text && uploadedFiles.length === 0) {
            throw new HttpException(
                'Files and given text are empty',
                HttpStatus.BAD_REQUEST
            )
        }

        const { id } = await this.roomMessageService.create(body, userId)

        await this.roomFileService.createBulk(uploadedFiles, id)

        const data = await this.roomMessageService.getByColumn(id, 'id')
        res.status(HttpStatus.OK).json({ data })
    }
}
