import { ConnectionOptions } from 'typeorm'

const config: ConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'chat-frontend_v3',
    synchronize: false,

    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/db/migrations/*{.ts,.js}'],

    cli: {
        migrationsDir: 'src/db/migrations',
        entitiesDir: 'src/**/*.entity{.ts,.js}',
    },
}

export default config
