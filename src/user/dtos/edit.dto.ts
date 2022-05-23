import { IsEmail, IsNotEmpty } from 'class-validator'

export class EditUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string
}
