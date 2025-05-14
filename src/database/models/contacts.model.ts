import { Contacts, StatusType } from '@/interfaces/contacts.interfaces';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type ContactCreationAttritubes = Optional<Contacts, 'id'>;

export class ContactsModel
    extends Model<Contacts, ContactCreationAttritubes>
    implements Contacts
{
    public id?: string | undefined;
    public userId!: string;
    public fileId!: string;
    public firstName!: string;
    public lastName!: string;
    public title!: string;
    public companyName!: string;
    public email!: string;
    public firstPhone!: string;
    public employees!: string;
    public industry!: string;
    public personLinkedinUrl!: string;
    public website!: string;
    public companyLinkedinUrl!: string;
    public companyAddress!: string;
    public companyCity!: string;
    public companyState!: string;
    public companyCountry!: string;
    public status!: StatusType;
    public createdAt: string | undefined;
    public updatedAt: string | undefined;
    public deletedAt: string | undefined;
    static associate(models: any) {
        ContactsModel.hasMany(models.SentEmail, {
            foreignKey: 'to',
            as: 'emailSent',
        });
    }
}

export default function (sequelize: Sequelize): typeof ContactsModel {
    ContactsModel.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fileId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstPhone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            employees: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            industry: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            personLinkedinUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyLinkedinUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyCity: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyState: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            companyCountry: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('pending', 'sent', 'failed'),
                allowNull: true,
                defaultValue: 'pending',
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'contacts',
            sequelize,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            timestamps: true,
        },
    );
    return ContactsModel;
}
