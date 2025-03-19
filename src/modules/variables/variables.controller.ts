import { Request, Response } from 'express';

import {
    createVariable,
    getAllVariable,
} from './variables.service';



export const getAllVariables = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const variables = await getAllVariable();
        res.status(200).json({
            message: 'vairables retrieved successfully',
            variables,
        });
    } catch (error: any) {
        console.error('Error in getAllVariables:', error);
        res.status(500).json({
            error: 'Failed to retrieve variables',
            details: error.message,
        });
    }
};
export const createVariables = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name, value } = req.body;

        // if (!name || !value) {
        //     res.status(400).json({ message: 'Name and value are required' });
        //     return;
        // }
        if (
            !name ||
            !value ||
            typeof name !== 'string' ||
            typeof value !== 'string'
        ) {
            res.status(400).json({
                message: 'Name and Value must be valid strings',
            });
            return;
        }
        const newVariable = await createVariable(name, value);
        res.status(201).json({
            message: 'Variable created successfully',
            variable: newVariable,
        });
    } catch (error: any) {
        console.error('Error in createVariables:', error);
        res.status(500).json({
            error: 'Failed to create variable',
            details: error.message,
        });
    }
};
