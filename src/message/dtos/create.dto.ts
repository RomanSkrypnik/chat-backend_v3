import { IsNotEmpty } from 'class-validator'

export class CreateMessageDto {
    text: string

    @IsNotEmpty()
    hash: string
}
