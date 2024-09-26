import Image from 'next/image'

import squirrel from '@/assets/logo.svg'

import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <>
      <div className='mx-auto flex max-w-[1200px] items-center justify-between'>
        <div className='flex items-center gap-3 font-medium'>
          <Image src={squirrel} className='size-6 dark:invert' alt='logo' />
          squirrel saas
        </div>
        <div className='flex items-center gap-4'>
          <ProfileButton />
        </div>
      </div>
    </>
  )
}
