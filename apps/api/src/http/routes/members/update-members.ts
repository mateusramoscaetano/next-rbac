import { roleSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/members/:memberId',
      {
        schema: {
          tags: ['members'],
          summary: ' Update a member ',
          security: [{ bearerAuth: [] }],

          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({ role: roleSchema }),
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()

        const { membership, organization } =
          await request.getUserMemberShip(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('update', 'User')) {
          throw new UnauthorizedError()
        }

        const { role } = request.body

        await prisma.member.update({
          where: { id: memberId, organizationId: organization.id },
          data: { role },
        })

        return reply.status(204).send()
      },
    )
}
