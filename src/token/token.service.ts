import { Injectable } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import { UserDto } from '../auth/dtos/user.dto'

@Injectable()
export class TokenService {
    generateTokens(user: UserDto) {
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_KEY, {
            expiresIn: '10h',
        })
        const accessToken = jwt.sign(user, process.env.JWT_ACCESS_KEY, {
            expires: '30min',
        })

        return { refreshToken, accessToken }
    }

    checkRefreshToken(token: string) {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    }

    checkAccessToken(token: string) {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    }
}
