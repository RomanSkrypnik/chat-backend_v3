import {MigrationInterface, QueryRunner} from "typeorm";

export class GeneralMigration1651692294006 implements MigrationInterface {
    name = 'GeneralMigration1651692294006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`chatId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`hash\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`activated\` tinyint NOT NULL DEFAULT 0, \`online\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_4a257d2c9837248d70640b3e36\` (\`email\`), UNIQUE INDEX \`IDX_cefd410393729bb8436c91bede\` (\`hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user1Id\` int NOT NULL, \`user2Id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Message\` ADD CONSTRAINT \`FK_c5370d7d3bc8ee603a401aee50e\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Message\` ADD CONSTRAINT \`FK_84d835397d0526ad7d04ef354e1\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat\` ADD CONSTRAINT \`FK_defdd0fbb93df091e60a28368d9\` FOREIGN KEY (\`user1Id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat\` ADD CONSTRAINT \`FK_47a53baa33f5ec7e8b69e229215\` FOREIGN KEY (\`user2Id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Chat\` DROP FOREIGN KEY \`FK_47a53baa33f5ec7e8b69e229215\``);
        await queryRunner.query(`ALTER TABLE \`Chat\` DROP FOREIGN KEY \`FK_defdd0fbb93df091e60a28368d9\``);
        await queryRunner.query(`ALTER TABLE \`Message\` DROP FOREIGN KEY \`FK_84d835397d0526ad7d04ef354e1\``);
        await queryRunner.query(`ALTER TABLE \`Message\` DROP FOREIGN KEY \`FK_c5370d7d3bc8ee603a401aee50e\``);
        await queryRunner.query(`DROP TABLE \`Chat\``);
        await queryRunner.query(`DROP INDEX \`IDX_cefd410393729bb8436c91bede\` ON \`User\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a257d2c9837248d70640b3e36\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Message\``);
    }

}
