import { UserDto } from '../../user/dtos'
import { FileDto } from '../../file/dtos'

export class MessageDto {
    id: number
    text: string
    createdAt: string
    files: [] | FileDto[]
    user: UserDto
}
