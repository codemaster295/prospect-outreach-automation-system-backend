import { Request } from 'express';
import models from 'models';
import db from 'models/_instance';
import contactfileValidation from 'helpers/contactfileValidation';
// import { ContactFileAttribute } from 'models/Contactfile'
import { Transaction } from 'sequelize/types';
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery';
import schema from 'controllers/ContactFile/schema';
import { validateBoolean } from 'helpers/Common';
// import Excel from 'helpers/Excel';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Corrected: added semicolon
  },
  filename(req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName); // Corrected: added semicolon
  },
});

const upload = multer({ storage }).single('file');

const { Sequelize } = db;
const { Op } = Sequelize;

const { Contactfile } = models;

class ContactfileService {
  public static async getAll(req: Request) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Contactfile,
    );
    const data = await Contactfile.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    });

    const total = await Contactfile.count({
      include: includeCount,
      where: queryFind.where,
    });

    return { message: `${total} data has been received.`, data, total };
  }

  public static async create(req: Request, txn?: Transaction) {
    return new Promise((resolve, reject) => {
      upload(req, null, async (err) => {
        if (err) {
          return reject(new Error('File upload failed.'));
        }

        const { fileUrl, uploadedBy } = req.body;

        // Validate form data using yup schema
        const value = contactfileValidation(schema.create, {
          fileUrl,
          uploadedBy,
        });

        // Get the uploaded file path (it will be stored in the 'uploads' directory)
        const filePath = req.file ? `/uploads/${req.file.filename}` : '';

        // Create a new contact file entry in the database
        const dataContactfile = await Contactfile.create(
          { fileUrl: filePath, uploadedBy, ...value },
          { transaction: txn },
        );

        resolve(dataContactfile);
      });
    });
  }

  public static async delete(id: string, force?: boolean) {
    const data = await this.findById(id);
    if (!data) {
      throw new Error('Contact file not found');
    }

    const isForce = validateBoolean(force);
    await data.destroy({
      force: isForce,
    });
    return { message: 'Contact file has been deleted successfully.' };
  }

  private static async findById(id: string) {
    const contactfile = await Contactfile.findOne({
      where: { id },
    });
    return contactfile;
  }
}

export default ContactfileService;
