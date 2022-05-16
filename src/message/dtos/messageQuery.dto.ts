import { IsNumberString } from 'class-validator'

export class MessageQueryDto {
    @IsNumberString()
    skip: number

    @IsNumberString()
    take: number
}
