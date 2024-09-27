import { Slash } from 'lucide-react'
import Image from 'next/image'

import squirrel from '@/assets/logo.svg'
import { ability } from '@/auth/auth'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'
import { ToggleTheme } from './theme/toggle-theme'

export async function Header() {
  const permissions = await ability()
  return (
    <>
      <div className='mx-auto flex max-w-[1200px] items-center justify-between p-4 shadow'>
        <div className='flex items-center gap-3 font-medium'>
          <Image src={squirrel} className='size-6 dark:invert' alt='logo' />

          <Slash className='size-4 -rotate-[24deg] text-border' />
          <OrganizationSwitcher />

          {permissions?.can('get', 'Project') && <p>projetos</p>}
        </div>
        <div className='flex items-center gap-8'>
          <ProfileButton />
          <ToggleTheme />
        </div>
      </div>
    </>
  )
}
