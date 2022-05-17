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
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from './dtos/'
import { Request, Response } from 'express'
import { TokenService } from '../token/token.service'
import { RtGuard } from './guards/rt.guard'
import { AtGuard } from './guards/at.guard'
import { UserService } from '../user/user.service'
import { UserDto } from '../user/dtos'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private tokenService: TokenService
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const user = await this.authService.register(registerDto)
        res.status(HttpStatus.OK).json({ data: user })
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const data = await this.authService.login(loginDto)

        res.cookie('refreshToken', data.tokens.refreshToken)
        res.status(HttpStatus.OK).json({ data })
    }

    @Get('logout')
    @UseGuards(AtGuard)
    logout(@Res() res: Response) {
        res.clearCookie('refreshToken')
        res.status(HttpStatus.OK).json({ message: 'User is logged out' })
    }

    @Get('refresh')
    @UseGuards(RtGuard)
    async refresh(@Req() req: Request, @Res() res: Response) {
        const user = req.user as UserDto

        const tokens = await this.tokenService.generateTokens(user)

        await this.userService.update(user.id, { online: true })

        res.cookie('refreshToken', tokens.refreshToken)
        res.status(HttpStatus.OK).json({ data: { user, tokens } })
    }
}
