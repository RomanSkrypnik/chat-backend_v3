import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @UseGuards(AuthGuard)
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const user = await this.authService.register(registerDto)
        res.status(HttpStatus.OK).json({ data: user })
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const data = await this.authService.login(loginDto)
        res.status(HttpStatus.OK).json({ data })
    }
}
