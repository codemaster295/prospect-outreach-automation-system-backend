import { SentEmail } from '@/interfaces/sentemail.interfaces';

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type SentemailCreationAttributes = Optional<SentEmail, 'id'>;

export class SentEmailModel
    extends Model<SentEmail, SentemailCreationAttributes>
    implements SentEmail
{
    id?: string;
    messageId!: string;
    campaignId!: string;
    from!: string;
    to!: string;
    subject!: string;
    email!: string;
    template!: string;
    owner!: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
    static associate(models: any) {
        SentEmailModel.belongsTo(models.Campaigns, {
            foreignKey: 'campaignId',
            as: 'campaignId_campaign',
        });
        SentEmailModel.belongsTo(models.Mailbox, {
            foreignKey: 'from',
            as: 'from_mailbox',
        });
        SentEmailModel.belongsTo(models.Contacts, {
            foreignKey: 'to',
            as: 'to_contacts',
        });
        SentEmailModel.belongsTo(models.Templates, {
            foreignKey: 'template',
            as: 'base_template',
        });
    }
}

export default function (sequelize: Sequelize): typeof SentEmailModel {
    SentEmailModel.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            messageId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            campaignId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'campaigns',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            from: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'mailboxes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            to: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'contacts',
                    key: 'id',
                },
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            template: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'template',
                    key: 'id',
                },
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
            tableName: 'sentemails',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return SentEmailModel;
}
