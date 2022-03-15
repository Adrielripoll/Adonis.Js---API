import Hash from '@ioc:Adonis/Core/Hash';
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
test.group('User', (group) => {
  test('It should create an user', async (assert) => {
    const userPayload = {
      email: 'test@test.com',
      name: 'test',
      password: 'test',
      avatar: 'http://image.com/image/1',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'ID undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.name, userPayload.name)
    assert.notExists(body.user.password, 'Password defined')
  })

  test('It should return 409 when email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        name: 'test',
        password: 'test',
      })
      .expect(409)

    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('It should return 409 when email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        name: 'test',
        password: 'test',
      })
      .expect(409)

    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('It should return 409 when name is already in use', async (assert) => {
    const { name } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'test@test.com',
        name,
        password: 'test',
      })
      .expect(409)

    assert.include(body.message, 'name')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('It should return 422 when require data is not provided', async (assert)=>{
    const {body} = await supertest(BASE_URL).post('/users').send({}).expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('It should return 422 when providing an invalid email', async (assert)=>{
    const {body} = await supertest(BASE_URL).post('/users').send({
      email:'teste@',
      password:'test',
      name:'test'
    }).expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('It should return 422 when providing an invalid password', async (assert)=>{
    const {body} = await supertest(BASE_URL).post('/users').send({
      email:'test@test.com',
      password:'123',
      name:'test'
    }).expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('It should update an user', async (assert)=>{
    const {id, password} = await UserFactory.create()
    const email = 'test@test.com'
    const avatar = 'https://avatars.githubusercontent.com/u/88801947?s=400&u=3ef7dec1849bcfc6eaae83705a3da5be24dbdc75&v=4'

    const {body} = await supertest(BASE_URL)
    .put(`/users/${id}`)
    .send({
      email,
      avatar,
      password,
    })
    .expect(200)
  })
    test('It should update user password', async (assert)=>{
      const user = await UserFactory.create()
      const password = 'test'

      const {body} = await supertest(BASE_URL)
      .put(`/users/${user.id}`)
      .send({
        email: user.email,
        avatar: user.avatar,
        password
      })
      .expect(200)


      await user.refresh()
      assert.exists(body.user, "User undefined")
      assert.equal(body.user.id, user.id)
      assert.isTrue(await Hash.verify(user.password, password))
    })

    test('It should return 422 when required data is not provided', async (assert) => {
      const {id} = await UserFactory.create()

      const {body} = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({})
      .expect(422)

      assert.equal(body.code, 'BAD_REQUEST')
      assert.equal(body.status, 422)

    })

    test('It should return 422 when providing an invalid email', async (assert) => {
      const {id, password, avatar} = await UserFactory.create()

      const {body} = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        email: "test@",
        password,
        avatar
      })
      .expect(422)
      assert.equal(body.code, 'BAD_REQUEST')
      assert.equal(body.status, 422)

    })

    test('It should return 422 when providing an invalid password', async (assert) => {
      const {id, email, avatar} = await UserFactory.create()

      const {body} = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        email,
        password:"tes",
        avatar
      })
      .expect(422)

      assert.equal(body.code, 'BAD_REQUEST')
      assert.equal(body.status, 422)

    })

    test('It should return 422 when providing an invalid avatar', async (assert) => {
      const {id, email, password} = await UserFactory.create()

      const {body} = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        email,
        password,
        avatar:"url_teste_fail"
      })
      .expect(422)

      assert.equal(body.code, 'BAD_REQUEST')
      assert.equal(body.status, 422)

    })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
