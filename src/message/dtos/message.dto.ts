import { UserDto } from '../../user/dtos'

export class MessageDto {
    id: number

    text: string

    file: null

    user: UserDto
}
