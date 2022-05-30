import {MigrationInterface, QueryRunner} from "typeorm";

export class GeneralMigration1653910930663 implements MigrationInterface {
    name = 'GeneralMigration1653910930663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Room_File\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`ext\` varchar(255) NOT NULL, \`messageId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Room_Messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`userId\` int NOT NULL, \`roomId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`avatar\` varchar(255) NULL, \`hash\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`bio\` varchar(255) NULL, \`hash\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`activated\` tinyint NOT NULL DEFAULT 0, \`online\` tinyint NOT NULL DEFAULT 0, \`lastSeen\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_cefd410393729bb8436c91bede\` (\`hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user1Id\` int NOT NULL, \`user2Id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`userId\` int NOT NULL, \`chatId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`File\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`ext\` varchar(255) NOT NULL, \`messageId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Blocked\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chatId\` int NOT NULL, \`blockerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Muted\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chatId\` int NOT NULL, \`muterId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room_host\` (\`roomId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_740ece5bf4a44cc8f7fccdda2c\` (\`roomId\`), INDEX \`IDX_685089bf8365e061ac9672bd86\` (\`userId\`), PRIMARY KEY (\`roomId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room_user\` (\`roomId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_507b03999779b22e06538595de\` (\`roomId\`), INDEX \`IDX_27dad61266db057665ee1b13d3\` (\`userId\`), PRIMARY KEY (\`roomId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Room_File\` ADD CONSTRAINT \`FK_116d84889edcf0caa5b7a060706\` FOREIGN KEY (\`messageId\`) REFERENCES \`Room_Messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Room_Messages\` ADD CONSTRAINT \`FK_59112efd8be4f2ed14840fc8adb\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Room_Messages\` ADD CONSTRAINT \`FK_0285d67915915daa9e699f3e5e9\` FOREIGN KEY (\`roomId\`) REFERENCES \`Room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat\` ADD CONSTRAINT \`FK_defdd0fbb93df091e60a28368d9\` FOREIGN KEY (\`user1Id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chat\` ADD CONSTRAINT \`FK_47a53baa33f5ec7e8b69e229215\` FOREIGN KEY (\`user2Id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Message\` ADD CONSTRAINT \`FK_c5370d7d3bc8ee603a401aee50e\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Message\` ADD CONSTRAINT \`FK_84d835397d0526ad7d04ef354e1\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`File\` ADD CONSTRAINT \`FK_66b1654f50bd49eafc6dc8f83df\` FOREIGN KEY (\`messageId\`) REFERENCES \`Message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Blocked\` ADD CONSTRAINT \`FK_e2217d668e2b823ba885a9ffa86\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Blocked\` ADD CONSTRAINT \`FK_6b5eec56041462aab26fb53271a\` FOREIGN KEY (\`blockerId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Muted\` ADD CONSTRAINT \`FK_2591ce3f4918ed5b057e7311539\` FOREIGN KEY (\`chatId\`) REFERENCES \`Chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Muted\` ADD CONSTRAINT \`FK_3f26a59e5d162fa6bdc10005a7d\` FOREIGN KEY (\`muterId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_host\` ADD CONSTRAINT \`FK_740ece5bf4a44cc8f7fccdda2cf\` FOREIGN KEY (\`roomId\`) REFERENCES \`Room\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`room_host\` ADD CONSTRAINT \`FK_685089bf8365e061ac9672bd86d\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_user\` ADD CONSTRAINT \`FK_507b03999779b22e06538595dec\` FOREIGN KEY (\`roomId\`) REFERENCES \`Room\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`room_user\` ADD CONSTRAINT \`FK_27dad61266db057665ee1b13d3d\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room_user\` DROP FOREIGN KEY \`FK_27dad61266db057665ee1b13d3d\``);
        await queryRunner.query(`ALTER TABLE \`room_user\` DROP FOREIGN KEY \`FK_507b03999779b22e06538595dec\``);
        await queryRunner.query(`ALTER TABLE \`room_host\` DROP FOREIGN KEY \`FK_685089bf8365e061ac9672bd86d\``);
        await queryRunner.query(`ALTER TABLE \`room_host\` DROP FOREIGN KEY \`FK_740ece5bf4a44cc8f7fccdda2cf\``);
        await queryRunner.query(`ALTER TABLE \`Muted\` DROP FOREIGN KEY \`FK_3f26a59e5d162fa6bdc10005a7d\``);
        await queryRunner.query(`ALTER TABLE \`Muted\` DROP FOREIGN KEY \`FK_2591ce3f4918ed5b057e7311539\``);
        await queryRunner.query(`ALTER TABLE \`Blocked\` DROP FOREIGN KEY \`FK_6b5eec56041462aab26fb53271a\``);
        await queryRunner.query(`ALTER TABLE \`Blocked\` DROP FOREIGN KEY \`FK_e2217d668e2b823ba885a9ffa86\``);
        await queryRunner.query(`ALTER TABLE \`File\` DROP FOREIGN KEY \`FK_66b1654f50bd49eafc6dc8f83df\``);
        await queryRunner.query(`ALTER TABLE \`Message\` DROP FOREIGN KEY \`FK_84d835397d0526ad7d04ef354e1\``);
        await queryRunner.query(`ALTER TABLE \`Message\` DROP FOREIGN KEY \`FK_c5370d7d3bc8ee603a401aee50e\``);
        await queryRunner.query(`ALTER TABLE \`Chat\` DROP FOREIGN KEY \`FK_47a53baa33f5ec7e8b69e229215\``);
        await queryRunner.query(`ALTER TABLE \`Chat\` DROP FOREIGN KEY \`FK_defdd0fbb93df091e60a28368d9\``);
        await queryRunner.query(`ALTER TABLE \`Room_Messages\` DROP FOREIGN KEY \`FK_0285d67915915daa9e699f3e5e9\``);
        await queryRunner.query(`ALTER TABLE \`Room_Messages\` DROP FOREIGN KEY \`FK_59112efd8be4f2ed14840fc8adb\``);
        await queryRunner.query(`ALTER TABLE \`Room_File\` DROP FOREIGN KEY \`FK_116d84889edcf0caa5b7a060706\``);
        await queryRunner.query(`DROP INDEX \`IDX_27dad61266db057665ee1b13d3\` ON \`room_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_507b03999779b22e06538595de\` ON \`room_user\``);
        await queryRunner.query(`DROP TABLE \`room_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_685089bf8365e061ac9672bd86\` ON \`room_host\``);
        await queryRunner.query(`DROP INDEX \`IDX_740ece5bf4a44cc8f7fccdda2c\` ON \`room_host\``);
        await queryRunner.query(`DROP TABLE \`room_host\``);
        await queryRunner.query(`DROP TABLE \`Muted\``);
        await queryRunner.query(`DROP TABLE \`Blocked\``);
        await queryRunner.query(`DROP TABLE \`File\``);
        await queryRunner.query(`DROP TABLE \`Message\``);
        await queryRunner.query(`DROP TABLE \`Chat\``);
        await queryRunner.query(`DROP INDEX \`IDX_cefd410393729bb8436c91bede\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Room\``);
        await queryRunner.query(`DROP TABLE \`Room_Messages\``);
        await queryRunner.query(`DROP TABLE \`Room_File\``);
    }

}
