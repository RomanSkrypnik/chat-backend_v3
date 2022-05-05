import { ConnectionOptions } from 'typeorm'

type OrmConfig = {
    seeds: string[]
    factories: string[]
} & ConnectionOptions

const config: OrmConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'chat_v3',
    synchronize: false,

    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
    seeds: [__dirname + '/db/seeders/*.seed{.ts,.js}'],
    factories: [__dirname + '/db/factories/*.factory{.ts,.js}'],

    cli: {
        migrationsDir: 'src/db/migrations',
        entitiesDir: 'src/**/*.entity{.ts,.js}',
    },
}

export default config
