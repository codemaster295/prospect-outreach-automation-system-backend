import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'
import db from './_instance'

export interface ContactAttributes {
  id: string
  lastName: string
  title: string
  companyName: string
  email: string
  firstPhone: string
  employees: string
  industry: string
  personLinkedinUrl: string
  website: string
  companyLinkedinUrl: string
  companyAddress: string
  companyCity: string
  companyState: string
  companyCountry: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}
interface ContactCreationAttribute extends Optional<ContactAttributes, 'id'> {}

export interface ContactInstance
  extends Model<ContactAttributes, ContactCreationAttribute>,
    ContactAttributes {}

const Contact = db.sequelize.define<ContactInstance>('Contacts', {
  ...SequelizeAttributes.contacts,
})

export default Contact
