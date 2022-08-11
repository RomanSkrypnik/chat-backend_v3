import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Not, Repository } from 'typeorm'
import { User } from './user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dtos'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
    }

    async getAll(id: number): Promise<User[]> {
        return await this.userRepository.find({
            where: { id: Not(id) },
        })
    }

    async getByColumn(item, column): Promise<User> {
        return await this.userRepository.findOne({ [column]: item })
    }

    async getBySearch(name: string) {
        return await this.userRepository.find({
            where: { name: ILike(`${name}%`) },
        })
    }

    async getOneWith(id: number, ...relations) {
        return await this.userRepository.findOne({
            where: { id },
            relations,
        })
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const entity = Object.assign(new User(), createUserDto)
        return await this.userRepository.save(entity)
    }

    async update(id: number, fields: Partial<User>) {
        const user = await this.userRepository.findOne({ id })

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }

        return await this.userRepository.save(Object.assign(user, fields))
    }

    async comparePasswords(id: number, password: string) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .addSelect('user.password')
            .getOne()

        if (user.password !== password) {
            throw new HttpException(
                'Wrong old password',
                HttpStatus.BAD_REQUEST
            )
        }

        return true
    }
}
