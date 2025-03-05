import { Files } from '@/interfaces/files.interfaces';

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type FileCreationAttributes = Optional<Files, 'id'>;

export class FileModel
    extends Model<Files, FileCreationAttributes>
    implements Files
{
    id?: string | undefined;
    fileUrl!: string;
    uploadedBy!: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}

export default function (sequelize: Sequelize): typeof FileModel {
    FileModel.init(
        {
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

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'Files',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return FileModel;
}
