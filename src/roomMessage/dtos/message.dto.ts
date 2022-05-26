import { UserDto } from '../../user/dtos'
import { RoomFileDto } from '../../roomFile/dtos'

export interface RoomMessageDto {
    id: number
    roomId: number
    text: string
    user: UserDto
    files: [] | RoomFileDto[]
    createdAt: string
}
