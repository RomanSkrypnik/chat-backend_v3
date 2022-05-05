import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dtos'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async getByColumn(item, column) {
        return await this.userRepository.findOne({ [column]: item })
    }

    async create(createUserDto: CreateUserDto) {
        const entity = Object.assign(new User(), createUserDto)
        return await this.userRepository.save(entity)
    }
}
