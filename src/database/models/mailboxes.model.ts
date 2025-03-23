import { Mailbox, MailboxType } from '@/interfaces/mailboxes.interfaces';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type MailboxCreationAttributes = Optional<Mailbox, 'id'>;

export class MailboxModel
    extends Model<Mailbox, MailboxCreationAttributes>
    implements Mailbox
{
    id?: string;
    senderEmail!: string;
    owner!: string;
    provider!: MailboxType; // Enum values
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
    static associate(models: any) {
        MailboxModel.hasOne(models.Campaigns, {
            foreignKey: 'mailbox',
            as: 'campaign',
        });
    }
}

export default function (sequelize: Sequelize): typeof MailboxModel {
    MailboxModel.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            senderEmail: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            owner: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            provider: {
                type: DataTypes.ENUM,
                values: ['google', 'microsoft', 'smtp'],
                allowNull: false,
            },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'mailboxes',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return MailboxModel;
}
