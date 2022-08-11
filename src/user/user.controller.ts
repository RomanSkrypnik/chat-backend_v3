import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { AtGuard } from '../auth/guards/at.guard'
import { Request, Response } from 'express'
import { UserService } from './user.service'
import { EditUserDto } from './dtos'
import { User } from './decorators/user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Get()
    @UseGuards(AtGuard)
    async users(@User('id') userId, @Body() body, @Res() res: Response) {
        const data = await this.userService.getAll(userId)
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

    @Post('edit')
    @UseGuards(AtGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    async edit(
        @UploadedFile() file: Express.Multer.File,
        @User('id') userId: number,
        @Body() body: EditUserDto,
        @Res() res: Response,
    ) {
        const fields = { ...body, avatar: file.filename }
        await this.userService.update(userId, fields)

        const data = await this.userService.getByColumn(userId, 'id')
        res.status(HttpStatus.OK).json({ data })
    }

    @Post('change-password')
    @UseGuards(AtGuard)
    async changePassword(
        @User('id') userId: number,
        @Body() body: { password: string },
        @Res() res: Response,
    ) {
        await this.userService.update(userId, body)
        res.status(HttpStatus.OK).json({ message: 'Password changed' })
    }

    @Post('compare-password')
    @UseGuards(AtGuard)
    async comparePassword(
        @User('id') userId: number,
        @Body() body: { password: string },
        @Res() res: Response,
    ) {
        const data = await this.userService.comparePasswords(
            userId,
            body.password,
        )
        res.status(HttpStatus.OK).json({ data })
    }
}
