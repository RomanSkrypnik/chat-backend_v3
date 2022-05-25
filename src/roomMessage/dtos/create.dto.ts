import { IsNotEmpty } from 'class-validator'

export class CreateRoomMessageDto {
    text: string

    @IsNotEmpty()
    roomId: number
}
