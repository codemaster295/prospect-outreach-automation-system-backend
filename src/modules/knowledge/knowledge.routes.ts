import express from 'express';

import { createKnowledge } from '@/modules/knowledge/knowledge.controller'; 

const knowledgeRouter = express.Router();
knowledgeRouter.post('/add', createKnowledge);

export default knowledgeRouter;
