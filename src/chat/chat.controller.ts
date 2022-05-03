import { Body, Controller, HttpStatus, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { ChatService } from './chat.service'
import { User } from '../user/decorators/user.decorator'

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}
}
