import { ContactFiles } from "@/interfaces/contactFiles.interfaces";

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export type ContactFileCreationAttributes = Optional<ContactFiles,'id'>

export class ContactFileModel 
    extends Model<ContactFiles,ContactFileCreationAttributes>
    implements ContactFiles
{
    id?: string | undefined;
    fileUrl!: string;
    uploadedBy!: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
    
}

export default function (sequelize:Sequelize):typeof ContactFileModel {
    ContactFileModel.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          fileUrl: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          uploadedBy: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          createdAt:DataTypes.DATE,
          updatedAt:DataTypes.DATE,
          deletedAt:DataTypes.DATE
        },
        {
            tableName:'ContactFiles',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt:'deletedAt',
            timestamps: true,
        }
    );
    return ContactFileModel;

}