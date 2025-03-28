import { Sequelize } from 'sequelize';
import { Contacts } from '../interfaces/contacts.interfaces';

class MicrosoftLoader {
    private db: Sequelize;

    constructor(dbInstance: Sequelize) {
        this.db = dbInstance;
    }
    async sendEmail(subject: string, body: string, recipient: string) {

    }
}

export default MicrosoftLoader;
