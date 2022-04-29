import { Body, Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('register')
    register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const user = this.authService.register(registerDto)

        res.status(HttpStatus.OK).json({ data: user })
    }

    @Get('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
}
