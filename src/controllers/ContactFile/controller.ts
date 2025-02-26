import { NextFunction, Request, Response } from 'express';
import routes from 'routes/public';
import asyncHandler from 'helpers/asyncHandler';
import BuildResponse from 'modules/Response/BuildResponse';
import ContactfileService from 'controllers/ContactFile/service';
import ExpressErrorYup from 'middlewares/ExpressErrorYup';


routes.get(
  '/contactfile',
  ExpressErrorYup,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await ContactfileService.getAll(req);
    const buildResponse = BuildResponse.get(data);
    return res.status(200).json(buildResponse);
  }),
);
routes.post(
  '/contactfile',
  ExpressErrorYup,
  asyncHandler(async function createContactfile(req: Request, res: Response, next: NextFunction) {
    const txn = await req.getTransaction();
    const formData = req.getBody();
    // Create the contact file
    const data = await ContactfileService.create(req, txn);
    req.setState({ contactfileData: data, formData });
    next();
  }),
);
routes.delete(
  '/contactfile/delete/:id',
  ExpressErrorYup,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams();
    await ContactfileService.delete(id);
    const buildResponse = BuildResponse.deleted({});
    return res.status(200).json(buildResponse);
  }),
);
routes.delete(
  '/contactfile/:id',
  ExpressErrorYup,
  asyncHandler(async function deleteContactfile(req: Request, res: Response) {
    const { id } = req.getParams();
    await ContactfileService.delete(id);
    const buildResponse = BuildResponse.deleted({});
    return res.status(200).json(buildResponse);
  }),
);
