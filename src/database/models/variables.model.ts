import { Variables } from '@/interfaces/variables';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type VariablesCreationAttributes = Optional<Variables, 'id'>;

export class VariablesModel
    extends Model<Variables, VariablesCreationAttributes>
    implements Variables
{
    id?: string | undefined;
    name!: string;
    value!: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}

export default function (sequelize: Sequelize): typeof VariablesModel {
    VariablesModel.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'variables',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return VariablesModel;
}
