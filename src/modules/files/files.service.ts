import { DB } from '@/database/index';
import { Files } from '@/interfaces/files.interfaces';
import { FindOptions } from 'sequelize';
const File = DB.Files;
export const getAllFiles = async (query: FindOptions<Files>) => {
    try {
        const files = await File.findAll(query);
        return files;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw new Error('Database query failed');
    }
};

export const createFile = async (data: Files) => {
    try {
        const file = await File.create(data);
        return file;
    } catch (error) {
        console.error('Error creating file:', error);
        throw new Error('Database query failed');
    }
};

export const getFile = async (id: string) => {
    try {
        const file = await File.findByPk(id);
        return file;
    } catch (error) {
        console.error('Error fetching file:', error);
        throw new Error('Database query failed');
    }
};
