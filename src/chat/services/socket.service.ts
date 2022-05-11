import { Injectable } from '@nestjs/common'
import { SocketDto } from '../dtos'

@Injectable()
export class SocketService {
    getOne(sockets: SocketDto[], hash: string): SocketDto {
        return sockets.find((socket) => socket?.user?.hash === hash)
    }
}
