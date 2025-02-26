import * as yup from 'yup'

// Define the schema for the data
const create = yup.object({
  fileUrl: yup.string().required('FileUrl is required'),
  uploadedBy: yup.string().required('Uploaded is required'),
})

// TypeScript type for the input data based on the schema
export type CreateInput = yup.InferType<typeof create>

export default {
  create,
}
