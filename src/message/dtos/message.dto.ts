import { IsNotEmpty } from 'class-validator'

export class MessageDto {
    @IsNotEmpty()
    text: string

    file: null
}
