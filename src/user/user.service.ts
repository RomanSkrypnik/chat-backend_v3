import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { Injectable } from '@nestjs/common'
import { RegisterDto } from '../auth/dtos'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async getByColumn(item, column) {
        return await this.userRepository.findOne({ [column]: item })
    }

    async create(registerDto: RegisterDto) {
        return await this.userRepository.save(registerDto)
    }
}
