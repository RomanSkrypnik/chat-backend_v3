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
import { AuthGuard } from '@nestjs/passport'
import { TokenService } from '../token/token.service'
import { User } from '../user/user.entity'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
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
    @UseGuards(AuthGuard('at-strategy'))
    logout(@Res() res: Response) {
        res.clearCookie('refreshToken')
        res.status(HttpStatus.OK).json({ message: 'User is logged out' })
    }

    @Get('refresh')
    @UseGuards(AuthGuard('rt-strategy'))
    async refresh(@Req() req: Request, @Res() res: Response) {
        const data = await this.tokenService.generateTokens(req.user as User)

        res.cookie('refreshToken', data.refreshToken)
        res.status(HttpStatus.OK).json({ data })
    }
}
