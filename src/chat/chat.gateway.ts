import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server

    async handleConnection(client: any, ...args: any[]) {
        console.log(client)
    }

    async handleDisconnect(client: any): Promise<any> {
        console.log('disconnect')
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        console.log(message)
        this.server.emit('message')
    }
}
