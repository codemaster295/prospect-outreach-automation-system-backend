import { Model, Optional } from 'sequelize';
import SequelizeAttributes from '../utils/SequelizeAttributes';
import db from './_instance';

export interface ContactFileAttribute {
  id: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
// eslint-disable-next-line prettier/prettier
interface ContactFileCreationAttribute extends Optional<ContactFileAttribute, 'id'> {}

export interface ContactFileInstance
  extends Model<ContactFileAttribute, ContactFileCreationAttribute>,
    ContactFileAttribute {}

const Contactfile = db.sequelize.define<ContactFileInstance>('ContactFiles', {
  ...SequelizeAttributes.Contactfile,
});

export default Contactfile;
