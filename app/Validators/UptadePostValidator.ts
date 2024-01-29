import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules } from '@adonisjs/validator/build/src/Rules';

export default class UptadePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.minLength(5)
    ]),
    content: schema.string({ trim: true }, [
      rules.minLength(15)
    ]),
    online: schema.boolean.nullableAndOptional(),
    categoryId: schema.number([
      rules.exists({ table: 'categories', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {}
}
