import { Injectable } from '@nestjs/common'
import { SocketDto } from '../dtos'

@Injectable()
export class SocketService {
    getOne(sockets: SocketDto[], hash: string): SocketDto {
        return sockets.find((socket) => socket?.user?.hash === hash)
    }

    broadcast(
        sockets: SocketDto[],
        event: string,
        message: any,
        client: SocketDto
    ) {
        for (const socket of sockets) {
            if (socket.id !== client.id) {
                socket.emit(event, message)
            }
        }
    }
}
