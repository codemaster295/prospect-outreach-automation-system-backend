import express from 'express';
import {
    getAllVariableController,
    createVariableController,
} from './variables.controller';

const variableRouter = express.Router();

variableRouter.get('/', getAllVariableController);
variableRouter.post('/', createVariableController);

export default variableRouter;
