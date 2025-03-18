import { Campaigns } from "@/interfaces/campaigns";
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type CampaignsCreationAttributes = Optional<Campaigns, 'id'>;


export class CampaignsModel
    extends Model<Campaigns, CampaignsCreationAttributes>
    implements Campaigns
{
    id?: string | undefined;
    name!:string;
    audience!: string;
    template!: string;
    delay!: {
        interval: number;
        unit: string;
      };
      owner!:string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
    static associate(models: any) {
        CampaignsModel.belongsTo(models.FileModel, { foreignKey: 'audience', as: 'file' });
        CampaignsModel.belongsTo(models.TemplateModel, { foreignKey: 'template', as: 'templateData' });
      }
}

export default function (sequelize: Sequelize): typeof CampaignsModel {
    CampaignsModel.init(
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
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                  model: 'files', 
                  key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
              },
              template: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                  model: 'templates', 
                  key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
              },
              delay: {
                type: DataTypes.JSON, 
                allowNull: true,
              },
              owner: {
                type: DataTypes.STRING, 
                allowNull: true,
              },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'campaigns',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return CampaignsModel;
}
