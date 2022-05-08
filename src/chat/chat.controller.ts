import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { ChatService } from './chat.service'
import { AtGuard } from '../auth/guards/at.guard'
import { User } from '../user/decorators/user.decorator'
import { Request, Response } from 'express'
import { ChatSearchDto } from './dtos'

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    @UseGuards(AtGuard)
    async chats(@User('id') userId, @Res() res: Response) {
        const data = await this.chatService.getChats(userId)
        res.status(HttpStatus.OK).json({ data })
    }

    @Get(':hash')
    @UseGuards(AtGuard)
    async chat(@User('id') userId, @Req() req: Request, @Res() res: Response) {
        const { hash } = req.params
        const data = await this.chatService.getChat(userId, hash)

        res.status(HttpStatus.OK).json({ data })
    }

    @Post('search')
    @UseGuards(AtGuard)
    async search(
        @User('id') userId,
        @Body() body: ChatSearchDto,
        @Res() res: Response
    ) {
        const data = await this.chatService.getChatBySearch(userId, body.search)
        res.status(HttpStatus.OK).json({ data })
    }
}
