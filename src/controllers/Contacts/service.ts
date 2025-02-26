import { Request } from 'express'
import models from 'models'
import db from 'models/_instance'
// import ResponseError from 'modules/Response/ResponseError'; // Uncomment if you want to handle errors
import contactValidation from 'helpers/contactValidation'
import { ContactAttributes } from 'models/Contacts'
import { Transaction } from 'sequelize/types'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from 'controllers/Contacts/schema'
import { validateBoolean } from 'helpers/Common'

const { Sequelize } = db
const { Op } = Sequelize

const { Contacts } = models

class ContactService {
  // public static async update(
  //   id: string,
  //   formData: ContactAttributes,
  //   txn?: Transaction
  // ) {
  //   const data = await this.findById(id)
  //   const value = contactValidation(schema.create, {
  //     ...data.toJSON(),
  //     ...formData,
  //   })
  //   await data.update(value || {}, { transaction: txn })
  //   return data
  // }

  /**
   * Get all contacts with query options like filters, pagination, etc.
   
   * @param req - Request
   */
  public static async getAll(req: Request) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Contacts
    )

    const data = await Contacts.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })

    const total = await Contacts.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  public static async create(formData: ContactAttributes, txn?: Transaction) {
    // Validate form data
    const value = contactValidation(schema.create, formData)

    // Create contact using Sequelize
    const dataContact = await Contacts.create(value, {
      transaction: txn,
    })

    return dataContact
  }

  /**
   * Delete a contact by ID.
   
   * @param id - Contacts ID to be deleted
   * @param force - Whether to force delete the contact (permanently remove, bypassing soft delete)
   */
  public static async delete(id: string, force?: boolean) {
    const data = await this.findById(id)
    if (!data) {
      throw new Error('Contacts not found')
    }
    const isForce = validateBoolean(force)
    await data.destroy({
      force: isForce,
    })
    return { message: 'Contacts has been deleted successfully.' }
  }

  private static async findById(id: string) {
    const contact = await Contacts.findOne({
      where: { id },
    })
    return contact
  }
}

export default ContactService
