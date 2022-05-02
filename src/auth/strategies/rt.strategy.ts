import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../../user/user.service'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt-strategy') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.refreshToken,
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payload: any) {
        const user = await this.userService.getByColumn(payload.email, 'email')

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        return user
    }
}
