import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { User } from '../user/decorators/user.decorator'
import { RoomService } from './room.service'
import { AtGuard } from '../auth/guards/at.guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    @UseGuards(AtGuard)
    async get(
        @User('id') userId: number,
        @Query() query,
        @Res() res: Response
    ) {
        const { skip, take } = query
        const data = await this.roomService.getRooms(+skip, +take)
        res.status(HttpStatus.OK).json({ data })
    }

    @Get(':hash')
    @UseGuards(AtGuard)
    async getOne(
        @User('id') userId: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { hash } = req.params
        const data = await this.roomService.getRoom(hash)
        res.status(HttpStatus.OK).json({ data })
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('avatar'))
    @UseGuards(AtGuard)
    async create(
        @User('id') userId: number,
        @UploadedFile() avatar: Express.Multer.File,
        @Body() body: { name: string },
        @Res() res: Response
    ) {
        const { id } = await this.roomService.create(userId, {
            ...body,
            avatar: avatar.filename,
        })

        const data = await this.roomService.getByColumn(id, 'id')

        res.status(HttpStatus.OK).json({ data })
    }
}
