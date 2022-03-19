import Mail from '@ioc:Adonis/Addons/Mail';
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Password', (group)=>{

  test.only('It should send email with forgot password instructions', async (assert)=>{
    const user = await UserFactory.create()

    Mail.trap((message)=>{
      assert.deepEqual(message.to, [
        {
          address: user.email
        }
      ])
      assert.deepEqual(message.from,
        {
          address: 'no-reply@roleplay.com'
        }
      )
      assert.equal(message.subject, "Roleplay: Recuperção de senha")
      assert.include(message.html!, user.name)
    })
    await supertest(BASE_URL)
    .post('/forgot-password')
    .send({
      email: user.email,
      resetPasswordUrl: 'url'
    })
    .expect(200)

    Mail.restore()

  })

  group.beforeEach(async ()=>{
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async ()=>{
    await Database.rollbackGlobalTransaction()
  })
})
