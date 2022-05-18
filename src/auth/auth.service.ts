import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterDto, LoginDto } from './dtos'
import * as bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service'
import { UserService } from '../user/user.service'
import { randomBytes } from 'crypto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private userService: UserService,
        private tokenService: TokenService
    ) {}

    async register(registerDto: RegisterDto) {
        const user = await this.userService.getByColumn(
            registerDto.email,
            'email'
        )

        if (user) {
            throw new HttpException(
                'User with such email already exists',
                HttpStatus.BAD_REQUEST
            )
        }

        const hash = randomBytes(32).toString('hex')

        return this.userService.create({ ...registerDto, hash })
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email: loginDto.email })
            .addSelect('user.password')
            .getOne()

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        const passwordMatches = await bcrypt.compare(
            loginDto.password,
            user.password
        )

        if (!passwordMatches) {
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST)
        }

        const tokens = await this.tokenService.generateTokens(user)

        delete user.password

        await this.userRepository.update(user.id, { online: true })

        return { tokens, user: { ...user, online: true } }
    }
}
