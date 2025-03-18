import { Template } from '@/interfaces/template';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type TemplateCreationAttributes = Optional<Template, 'id'>;

export class TemplateModel
    extends Model<Template, TemplateCreationAttributes>
    implements Template
{
    id?: string | undefined;
    subject!: string;
    body!: string;
    owner!: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}

export default function (sequelize: Sequelize): typeof TemplateModel {
    TemplateModel.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            body: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            owner: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'templates',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return TemplateModel;
}
