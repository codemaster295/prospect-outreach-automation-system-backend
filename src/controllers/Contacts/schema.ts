import * as yup from 'yup'

// Define the schema for the data
const create = yup.object({
  fileId: yup.string().required('fileId is required'),
  lastName: yup.string().required('fullname is required'),
  title: yup.string().email('invalid email').required('email is required'),
  companyName: yup.string().required('phone is required'),
  email: yup.string().email('invalid email').required('email is required'),
  firstPhone: yup.string().required('phone is required'),
  employees: yup.string().required('employees is required'),
  industry: yup.string().required('industry is required'),
  personLinkedinUrl: yup.string().required('personLinkedinUrl is required'),
  website: yup.string().required('website is required'),
  companyLinkedinUrl: yup.string().required('companyLinkedinUrl is required'),
  companyAddress: yup.string().required('companyAddress is required'),
  companyCity: yup.string().required('companyCity is required'),
  companyState: yup.string().required('companyState is required'),
  companyCountry: yup.string().required('companyCountry is required'),
})

// TypeScript type for the input data based on the schema
export type CreateInput = yup.InferType<typeof create>

export default {
  create,
}
