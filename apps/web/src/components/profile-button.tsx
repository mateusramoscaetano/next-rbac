import { ChevronDown, LogOut } from 'lucide-react'

import { auth } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export async function ProfileButton() {
  const { user } = await auth()

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center gap-3 outline-none'>
          <div className='flex flex-col items-end'>
            <span className='text-sm font-medium'>{user.name}</span>
            <span className='text-xs text-muted-foreground'>{user.email}</span>
          </div>
          <Avatar className='size-8'>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback>
              {user.name && getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className='size-4 text-muted-foreground' />
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className=''>
          <DropdownMenuItem asChild>
            <a href={'/api/auth/sign-out'}>
              <LogOut className='mr-2 size-4' />
              sign out
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
