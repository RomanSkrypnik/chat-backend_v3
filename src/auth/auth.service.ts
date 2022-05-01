import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private tokenService: TokenService
    ) {}

    async register(registerDto: RegisterDto) {
        const user = await this.userRepository.findOne({
            email: registerDto.email,
        })

        if (user) {
            throw new HttpException(
                'User with such email already exists',
                HttpStatus.BAD_REQUEST
            )
        }

        const salt = await bcrypt.genSalt(6)

        const password = await bcrypt.hash(registerDto.password, salt)

        return this.userRepository.save({ ...registerDto, password })
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            email: loginDto.email,
        })

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const passwordMatches = await bcrypt.compare(
            loginDto.password,
            user.password,
        )

        if (!passwordMatches) {
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST)
        }

        const tokens = this.tokenService.generateTokens(user)

        return { ...tokens, user }
    }
}
