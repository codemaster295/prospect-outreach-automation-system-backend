import { Request, Response } from 'express';

import {
    createVariableService,
    getAllVariables,
    getVariableService,
} from './variables.service';

// export const getAllVariableController = async (
//     req: Request,
//     res: Response,
// ): Promise<void> => {
//     try {
//         const authorization = req.headers.authorization;

//         if (!authorization) {
//             res.status(404).json({ message: 'Variables not found' });
//             return;
//         }
//         const accessToken = authorization.split(' ')[1];

//         const vairables = await getVariableService(accessToken);
//         res.status(200).json({
//             message: 'Data retrieved successfully',
//             vairables,
//         });
//     } catch (error: any) {
//         console.error('Error in getAllVariableController:', error);
//         res.status(500).json({
//             error: 'Failed to retrieve vairables',
//             details: error.message,
//         });
//     }
// };

export const getAllVariableController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const variables = await getAllVariables();
        res.status(200).json({
            message: 'vairables retrieved successfully',
            variables,
        });
    } catch (error: any) {
        console.error('Error in getAllVariableController:', error);
        res.status(500).json({
            error: 'Failed to retrieve variables',
            details: error.message,
        });
    }
};
export const createVariableController = async (
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
        const newVariable = await createVariableService(name, value);
        res.status(201).json({
            message: 'Variable created successfully',
            variable: newVariable,
        });
    } catch (error: any) {
        console.error('Error in createVariableController:', error);
        res.status(500).json({
            error: 'Failed to create variable',
            details: error.message,
        });
    }
};
