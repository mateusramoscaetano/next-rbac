import { defineAbilityFor } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MEMBER' })

const canInvite = ability.can('invite', 'User')
const canDelete = ability.can('delete', 'User')

console.log(canInvite)
console.log(canDelete)
