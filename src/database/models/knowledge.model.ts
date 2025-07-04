import { Knowledge } from "@/interfaces/knowledge.interface";
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type KnowledgeCreationAttributes = Optional<Knowledge, 'id'>;

export class KnowledgeModel
    extends Model<Knowledge, KnowledgeCreationAttributes>
    implements Knowledge {
    id!: string;
    page!: string;
    title!: string;
    body!: string;
    campaign_id!: string;
    contact_id!: string;
    createdAt!: string;
    updatedAt!: string;
    deletedAt!: string;


    static associate(models: any) {
        KnowledgeModel.belongsTo(models.Campaigns, {
            foreignKey: 'campaign_id',
            as: 'campaigns',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        KnowledgeModel.belongsTo(models.Contacts, {
            foreignKey: 'contact_id',
            as: 'contacts',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    }
}
export default function (sequelize: Sequelize): typeof KnowledgeModel {
    KnowledgeModel.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,

            },
            page: {
                type: DataTypes.STRING,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            campaign_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'campaigns',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            contact_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'contacts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            tableName: 'knowledge',
            timestamps: true,
            paranoid: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
        },
    );

    return KnowledgeModel;
}