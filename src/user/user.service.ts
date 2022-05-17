import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dtos'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async getAll(): Promise<User[]> {
        return await this.userRepository.find()
    }

    async getByColumn(item, column): Promise<User> {
        return await this.userRepository.findOne({ [column]: item })
    }

    async getBySearch(hash: string) {
        return await this.userRepository.find({ where: { hash } })
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const entity = Object.assign(new User(), createUserDto)
        return await this.userRepository.save(entity)
    }

    async update(id: number, fields: Partial<User>) {
        return await this.userRepository.update(id, fields)
    }
}
