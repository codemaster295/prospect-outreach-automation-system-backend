import { MailboxConfig } from '@/interfaces/mailboxconfig.interfaces';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type MailboxconfigCreationAttributes = Optional<MailboxConfig, 'id'>;

export class MailboxConfigModel
    extends Model<MailboxConfig, MailboxconfigCreationAttributes>
    implements MailboxConfig
{
    id?: string;
    mailbox!: string;
    key!: string;
    value!: string;
    owner!: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
    static associate(models: any) {
        MailboxConfigModel.belongsTo(models.MailboxModel, {
            foreignKey: 'mailbox',
            as: 'mailbox',
        });
    }
}

export default function (sequelize: Sequelize): typeof MailboxConfigModel {
    MailboxConfigModel.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            mailbox: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'mailbox',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
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
            tableName: 'mailboxconfig',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return MailboxConfigModel;
}
