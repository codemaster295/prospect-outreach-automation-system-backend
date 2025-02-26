/* eslint-disable no-await-in-loop */
import { NextFunction, Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import BuildResponse from 'modules/Response/BuildResponse'
import ContactService from 'controllers/Contacts/service'
import ExpressErrorYup from 'middlewares/ExpressErrorYup'

// import { ContactInstance } from 'models/Contacts'

routes.get(
  '/contact',
  ExpressErrorYup,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await ContactService.getAll(req)
    const buildResponse = BuildResponse.get(data)
    return res.status(200).json(buildResponse)
  })
)

routes.post(  
  '/contact',
  ExpressErrorYup,
  asyncHandler(async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const data = await ContactService.create(formData, txn)
    req.setState({ concatData: data, formData })

    next()
  })
)
routes.delete(
  '/contact/delete/:id',
  ExpressErrorYup,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await ContactService.delete(id)
    const buildResponse = BuildResponse.deleted({})
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/contact/:id',
  ExpressErrorYup,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await ContactService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
// routes.put(
//   '/contact/:id',
//   ExpressErrorYup,
//   asyncHandler(async function updateContact(req: Request, res: Response) {
//     const { id } = req.getParams()
//     const formData = req.getBody()
//     // Pass the ID and updated data to the service layer
//     const updatedContact = await ContactService.update(id, formData)
//     const buildResponse = BuildResponse.get(updatedContact)
//     return res.status(200).json(buildResponse)
//   })
// )
