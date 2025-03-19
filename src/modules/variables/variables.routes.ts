import express from 'express';
import {
    getAllVariables,
    createVariables,
} from './variables.controller';

const variableRouter = express.Router();

variableRouter.get('/', getAllVariables);
variableRouter.post('/', createVariables);

export default variableRouter;
