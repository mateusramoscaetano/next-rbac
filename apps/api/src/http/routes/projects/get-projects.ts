import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:slug/projects/',
      {
        schema: {
          tags: ['projects'],
          summary: ' Get all organization projects ',
          security: [{ bearerAuth: [] }],

          params: z.object({
            slug: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { slug } = request.params

        const { membership, organization } =
          await request.getUserMemberShip(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Project')) {
          throw new UnauthorizedError()
        }

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: { organizationId: organization.id },
          orderBy: { createdAt: 'desc' },
        })

        return reply.status(200).send({ projects })
      },
    )
}
