import { Analytics, AnalyticsKey } from '@/interfaces/analytics.interfaces';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type AnalyticsCreationAttributes = Optional<Analytics, 'id'>;

export class AnalyticsModel
    extends Model<Analytics, AnalyticsCreationAttributes>
    implements Analytics
{
    id!: string;
    contactId!: string;
    sentEmailId!: string;
    campaignId!: string;
    key!: AnalyticsKey;
    value!: number;
    createdAt!: string;
    updatedAt!: string;
    deletedAt!: string;

    static associate(models: any) {
        AnalyticsModel.belongsTo(models.Contacts, {
            foreignKey: 'contactId',
            as: 'contact',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        AnalyticsModel.belongsTo(models.SentEmail, {
            foreignKey: 'sentEmailId',
            as: 'sentEmail',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        AnalyticsModel.belongsTo(models.Campaigns, {
            foreignKey: 'campaignId',
            as: 'campaign',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    }
}

export default function (sequelize: Sequelize): typeof AnalyticsModel {
    AnalyticsModel.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            campaignId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'campaigns',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            contactId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'contacts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            sentEmailId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'sentemails',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            key: {
                type: DataTypes.ENUM(...Object.values(AnalyticsKey)),
                allowNull: false,
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            tableName: 'analytics',
            timestamps: true,
            paranoid: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        },
    );

    return AnalyticsModel;
}
