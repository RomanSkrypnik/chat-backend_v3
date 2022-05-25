import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { AtGuard } from '../auth/guards/at.guard'
import { User } from '../user/decorators/user.decorator'
import { Response } from 'express'
import { RoomMessageService } from './roomMessage.service'
import { CreateRoomMessageDto } from './dtos'
import { RoomFileService } from '../roomFile/roomFile.service'

@Controller('room-message')
export class RoomMessageController {
    constructor(
        private roomMessageService: RoomMessageService,
        private roomFileService: RoomFileService
    ) {}

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
