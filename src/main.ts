import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(new ValidationPipe())
    app.use(cookieParser())

    app.enableCors({
        origin: process.env.CLIENT_URL,
        methods: 'GET,POST',
        credentials: true,
    })

    app.setGlobalPrefix('api')

    await app.listen(process.env.APP_PORT || 5000)
}

bootstrap()
