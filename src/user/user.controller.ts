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
import { AtGuard } from '../auth/guards/at.guard'
import { Request, Response } from 'express'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @UseGuards(AtGuard)
    async users(@Res() res: Response) {
        const data = await this.userService.getAll()
        res.status(HttpStatus.OK).json({ data })
    }

    @Get(':hash')
    @UseGuards(AtGuard)
    async user(@Req() req: Request, @Res() res: Response) {
        const { hash } = req.params

        const data = await this.userService.getByColumn(hash, 'hash')

        res.status(HttpStatus.OK).json({ data })
    }

    @Post('search')
    @UseGuards(AtGuard)
    async search(@Body() body: { search: string }, @Res() res: Response) {
        const data = await this.userService.getBySearch(body.search)
        res.status(HttpStatus.OK).json({ data })
    }
}
