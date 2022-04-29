import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
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

        return this.userRepository.create({ ...registerDto, password })
    }

    login(loginDto: LoginDto) {
        return 'test'
    }
}
