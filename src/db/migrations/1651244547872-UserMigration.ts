import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMigration1651244547872 implements MigrationInterface {
    name = 'UserMigration1651244547872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`activated\` tinyint NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``
        )
        await queryRunner.query(`DROP TABLE \`user\``)
    }
}
