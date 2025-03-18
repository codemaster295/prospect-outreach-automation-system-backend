import { Campaign } from '@/interfaces/campaign';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type CampaignCreationAttributes = Optional<Campaign, 'id'>;

export class CampaignModel
    extends Model<Campaign, CampaignCreationAttributes>
    implements Campaign
{
    id?: string | undefined;
    name!: string;
    audience!: string;
    template!: string;
    delay!: {
        interval: number;
        unit: string;
    };
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}

export default function (sequelize: Sequelize): typeof CampaignModel {
    CampaignModel.init(
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
            },
            audience: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            template: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            delay: {
                type: DataTypes.JSON,
                allowNull: false,
            },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'Campaign',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return CampaignModel;
}
