import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function createOrganization({
  domain,
  name,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest) {
  return await api.post('organization', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
