import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common'
import { User } from '../user/decorators/user.decorator'
import { Response } from 'express'
import { MessageService } from './message.service'
import { CreateMessageDto } from './dtos/create.dto'
import { AtGuard } from '../auth/guards/at.guard'

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @UseGuards(AtGuard)
    @Post('create')
    async create(
        @User('id') userId: number,
        @Body() body: CreateMessageDto,
        @Res() res: Response
    ) {
        const data = await this.messageService.create(body, userId)
        res.status(HttpStatus.OK).json({ data })
    }
}
