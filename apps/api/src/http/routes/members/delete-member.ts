import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function deleteMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organization/:slug/members/:memberId',
      {
        schema: {
          tags: ['members'],
          summary: ' Delete a member ',
          security: [{ bearerAuth: [] }],

          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()

        const { membership, organization } =
          await request.getUserMemberShip(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('delete', 'User')) {
          throw new UnauthorizedError()
        }

        await prisma.member.delete({
          where: { id: memberId, organizationId: organization.id },
        })

        return reply.status(200).send()
      },
    )
}
