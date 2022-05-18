import {
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { AtGuard } from '../auth/guards/at.guard'
import { User } from '../user/decorators/user.decorator'
import { Request, Response } from 'express'
import { BlockedService } from './blocked.service'

@Controller('blocked')
export class BlockedController {
    constructor(private blockedService: BlockedService) {}

    @Get(':id')
    @UseGuards(AtGuard)
    async blockUnBlock(
        @User('id') userId,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const data = await this.blockedService.createOrDelete(
            userId,
            req.params.id
        )
        res.status(HttpStatus.OK).json({ data })
    }
}
