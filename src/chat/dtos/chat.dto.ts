import { UserDto } from '../../user/dtos'
import { MessageDto } from '../../message/dtos/message.dto'

export interface ChatDto {
    id: number
    user: UserDto
    messages: MessageDto[]
}
