import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

export async function createProject({
  org,
  description,
  name,
}: CreateProjectRequest) {
  return await api.post(`organization/${org}/projects`, {
    json: {
      name,
      description,
    },
  })
}
