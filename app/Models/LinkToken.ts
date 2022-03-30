import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from './User'

export default class LinkToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  //armazena id do usuário na tabela de token.
  @column({columnName: "user_id"})
  public userId: number

  //importa dados do usuário junto ao token
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
