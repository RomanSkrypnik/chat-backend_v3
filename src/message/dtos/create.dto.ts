import { IsNotEmpty } from 'class-validator'

export class CreateMessageDto {
    @IsNotEmpty()
    text: string

    @IsNotEmpty()
    hash: string

    files: Array<Express.Multer.File>
}
