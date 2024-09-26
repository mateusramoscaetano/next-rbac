import { api } from './api-client'

interface ISignUpWithPasswordRequest {
  name: string
  email: string
  password: string
}
type TSignUpResponse = void

export async function signUpWithPassword({
  name,
  email,
  password,
}: ISignUpWithPasswordRequest): Promise<TSignUpResponse> {
  await api.post('users', {
    json: {
      name,
      email,
      password,
    },
  })
}
