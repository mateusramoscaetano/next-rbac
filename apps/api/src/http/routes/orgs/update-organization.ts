import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { organizationSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug',
      {
        schema: {
          tags: ['organization'],
          summary: ' Update organization',
          security: [{ bearerAuth: [] }],
          params: z.object({ slug: z.string() }),
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomain } = request.body
        const { membership, organization } =
          await request.getUserMemberShip(slug)

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError()
        }

        if (domain) {
          const organizationDomain = await prisma.organization.findFirst({
            where: { domain, id: { not: organization.id } },
          })

          if (organizationDomain) {
            throw new BadRequestError(
              'Another organization with same domain already exist',
            )
          }

          await prisma.organization.update({
            where: { id: organization.id },
            data: {
              name,
              domain,
              shouldAttachUsersByDomain,
            },
          })

          return reply.status(204).send()
        }
      },
    )
}
