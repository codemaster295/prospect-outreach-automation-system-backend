import { Schedule } from '@/interfaces/schedule';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
export type ScheduleCreationAttributes = Optional<Schedule, 'id'>;

export class ScheduleModel
    extends Model<Schedule, ScheduleCreationAttributes>
    implements Schedule
{
    id!: string;
    campaign!: string;
    day!: string;
    count!: number;
    delay!: number;
    createdAt!: string;
    updatedAt!: string;
    deletedAt!: string;
    static associate(models: any) {
        ScheduleModel.belongsTo(models.Campaigns, {
            foreignKey: 'campaign',
            as: 'campaignDetails',
        });
    }
}
export default function (sequelize: Sequelize): typeof ScheduleModel {
    ScheduleModel.init(
        {
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            campaign: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            day: {
                type: DataTypes.ENUM(
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                ),
                allowNull: false,
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            delay: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'schedules',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return ScheduleModel;
}
