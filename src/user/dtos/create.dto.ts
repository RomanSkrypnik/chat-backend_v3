import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    hash: string
}
