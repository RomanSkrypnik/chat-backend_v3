import { IsNotEmpty } from 'class-validator'
import { MessageDto } from './message.dto'

export class CreateMessageDto {
    @IsNotEmpty()
    message: MessageDto

    @IsNotEmpty()
    hash: string
}
