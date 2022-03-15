import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.internet.password(),
    avatar: faker.internet.url(),
  }
}).build()
