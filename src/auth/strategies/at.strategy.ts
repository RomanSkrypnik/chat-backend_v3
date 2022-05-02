import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../../user/user.service'

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at-strategy') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        })
    }

    async validate(payload: any) {
        const user = await this.userService.getByColumn(payload.email, 'email')

        if (!user) {
            throw new HttpException('User is not found', HttpStatus.BAD_REQUEST)
        }

        return user
    }
}
