import { UserDto } from '../../user/dtos'

export class MessageDto {
    id: number

    text: string

    createdAt: string

    files: [] | File[]

    user: UserDto
}
