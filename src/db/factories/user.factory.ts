import { define } from 'typeorm-seeding'
import { User } from '../../user/user.entity'
import * as Faker from 'faker'
import { randomBytes } from 'crypto'

define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1)

    const firstName = faker.name.firstName(gender)
    const lastName = faker.name.lastName(gender)
    const email = faker.internet.email(gender)

    const user = new User()

    user.email = email
    user.name = firstName
    user.username = lastName
    user.password = faker.random.word()

    user.password = 'rorchenko'

    user.hash = randomBytes(32).toString('hex')

    return user
})
