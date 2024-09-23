import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: ' Create a new project ',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { slug } = request.params

        const { membership, organization } =
          await request.getUserMemberShip(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('create', 'Project')) {
          throw new UnauthorizedError()
        }

        const { name, description } = request.body

        const project = await prisma.project.create({
          data: {
            name,
            slug: name.replace(' ', '-'),
            ownerId: userId,
            description,
            organizationId: organization.id,
          },
        })

        return reply.status(201).send({ projectId: project.id })
      },
    )
}
