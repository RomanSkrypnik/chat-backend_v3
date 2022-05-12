import { Injectable } from '@nestjs/common'
import { File } from './file.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File) private fileRepository: Repository<File>
    ) {}

    async createBulk(files: Array<Express.Multer.File>, messageId: number) {
        const values = files.map((file) => {
            // TODO :: Create helper
            const fileSplit = file.filename.split('.')
            const ext = fileSplit[fileSplit.length - 1]

            return { ...file, messageId, ext }
        })

        return await this.fileRepository
            .createQueryBuilder()
            .insert()
            .values(values)
            .execute()
    }
}
