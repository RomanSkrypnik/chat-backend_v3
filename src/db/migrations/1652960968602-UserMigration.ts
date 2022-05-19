import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1652960968602 implements MigrationInterface {
    name = 'UserMigration1652960968602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`File\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`ext\` varchar(255) NOT NULL, \`messageId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`userId\` int NOT NULL, \`chatId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`hash\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`activated\` tinyint NOT NULL DEFAULT 0, \`online\` tinyint NOT NULL DEFAULT 0, \`lastSeen\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4a257d2c9837248d70640b3e36\` (\`email\`), UNIQUE INDEX \`IDX_cefd410393729bb8436c91bede\` (\`hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user1Id\` int NOT NULL, \`user2Id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Blocked\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chatId\` int NOT NULL, \`blockerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Muted\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chatId\` int NOT NULL, \`muterId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`File\` ADD CONSTRAINT \`FK_66b1654f50bd49eafc6dc8f83df\` FOREIGN KEY (\`messageId\`) REFERENCES \`Message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Message\` ADD CONSTRAINT \`FK_c5370d7d3bc8ee603a401aee50e\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Message\` ADD CONSTRAINT \`FK_84d835397d0526ad7d04ef354e1\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat\` ADD CONSTRAINT \`FK_defdd0fbb93df091e60a28368d9\` FOREIGN KEY (\`user1Id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat\` ADD CONSTRAINT \`FK_47a53baa33f5ec7e8b69e229215\` FOREIGN KEY (\`user2Id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Blocked\` ADD CONSTRAINT \`FK_e2217d668e2b823ba885a9ffa86\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Blocked\` ADD CONSTRAINT \`FK_6b5eec56041462aab26fb53271a\` FOREIGN KEY (\`blockerId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Muted\` ADD CONSTRAINT \`FK_2591ce3f4918ed5b057e7311539\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Muted\` ADD CONSTRAINT \`FK_3f26a59e5d162fa6bdc10005a7d\` FOREIGN KEY (\`muterId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Muted\` DROP FOREIGN KEY \`FK_3f26a59e5d162fa6bdc10005a7d\``);
        await queryRunner.query(`ALTER TABLE \`Muted\` DROP FOREIGN KEY \`FK_2591ce3f4918ed5b057e7311539\``);
        await queryRunner.query(`ALTER TABLE \`Blocked\` DROP FOREIGN KEY \`FK_6b5eec56041462aab26fb53271a\``);
        await queryRunner.query(`ALTER TABLE \`Blocked\` DROP FOREIGN KEY \`FK_e2217d668e2b823ba885a9ffa86\``);
        await queryRunner.query(`ALTER TABLE \`Chat\` DROP FOREIGN KEY \`FK_47a53baa33f5ec7e8b69e229215\``);
        await queryRunner.query(`ALTER TABLE \`Chat\` DROP FOREIGN KEY \`FK_defdd0fbb93df091e60a28368d9\``);
        await queryRunner.query(`ALTER TABLE \`Message\` DROP FOREIGN KEY \`FK_84d835397d0526ad7d04ef354e1\``);
        await queryRunner.query(`ALTER TABLE \`Message\` DROP FOREIGN KEY \`FK_c5370d7d3bc8ee603a401aee50e\``);
        await queryRunner.query(`ALTER TABLE \`File\` DROP FOREIGN KEY \`FK_66b1654f50bd49eafc6dc8f83df\``);
        await queryRunner.query(`DROP TABLE \`Muted\``);
        await queryRunner.query(`DROP TABLE \`Blocked\``);
        await queryRunner.query(`DROP TABLE \`Chat\``);
        await queryRunner.query(`DROP INDEX \`IDX_cefd410393729bb8436c91bede\` ON \`User\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a257d2c9837248d70640b3e36\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Message\``);
        await queryRunner.query(`DROP TABLE \`File\``);
    }

}
