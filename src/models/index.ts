import Role from './role'
import User from './user'
import UserRole from './userrole'
import RefreshToken from './refreshtoken'
import Session from './session'
import Contacts from './Contacts'
import Contactfile from './Contactfile'
const models = {
  Role,
  User,
  UserRole,
  RefreshToken,
  Session,
  Contacts,
  Contactfile
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model?.associate) {
    model.associate(models)
  }
  return model
})
