import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['projects'],
          summary: ' Get project details ',
          security: [{ bearerAuth: [] }],

          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { orgSlug, projectSlug } = request.params

        const { membership, organization } =
          await request.getUserMemberShip(orgSlug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Project')) {
          throw new UnauthorizedError()
        }

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: { slug: projectSlug, organizationId: organization.id },
        })

        if (!project) {
          throw new BadRequestError('not found project')
        }

        return reply.status(200).send({ project })
      },
    )
}
