import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RoomFile } from './roomFile.entity'

@Injectable()
export class RoomFileService {
    constructor(
        @InjectRepository(RoomFile)
        private roomFileRepository: Repository<RoomFile>
    ) {}

    async createBulk(files: Array<Express.Multer.File>, messageId: number) {
        const values = files.map((file) => {
            // TODO :: Create helper
            const fileSplit = file.filename.split('.')
            const ext = fileSplit[fileSplit.length - 1]

            return { ...file, messageId, ext }
        })

        return await this.roomFileRepository
            .createQueryBuilder()
            .insert()
            .values(values)
            .execute()
    }
}
