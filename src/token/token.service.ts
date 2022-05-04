import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokensDto } from '../auth/dtos'
import { UserDto } from '../user/dtos'

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) {}

    async generateTokens(user: UserDto): Promise<TokensDto> {
        const accessToken = await this.jwtService.signAsync(
            { ...user },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: 60 * 15,
            }
        )

        const refreshToken = await this.jwtService.signAsync(
            { ...user },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: 60 * 60 * 24 * 7,
            }
        )

        return { accessToken, refreshToken }
    }
}
