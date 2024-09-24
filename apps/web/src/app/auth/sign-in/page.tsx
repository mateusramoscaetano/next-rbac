import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/github.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { singInWithEmailAndPassword } from './actions'

export default function SignInPage() {
  return (
    <>
      <form action={singInWithEmailAndPassword} className='space-y-4'>
        <div className='space-y-1'>
          <Label htmlFor='email'>E-mail</Label>
          <Input name='email' type='email' id='email' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='password'>Password</Label>
          <Input name='password' type='password' id='password' />

          <Link
            href={'/auth/forgot-password'}
            className='text-muted-foreground text-xs font-medium hover:underline'
          >
            Forgot your password?
          </Link>
        </div>

        <Button type='submit' className='w-full'>
          Sign in with e-mail
        </Button>
        <Button variant={'link'} className='w-full' size={'sm'} asChild>
          <Link href={'/auth/sign-in'}>Create new account</Link>
        </Button>
        <Separator />
        <Button variant={'outline'} className='w-full'>
          <Image
            src={githubIcon}
            width={16}
            height={16}
            className='mr-2 size-4 dark:invert'
            alt='dads'
          />
          Sign in with GitHub
        </Button>
      </form>
    </>
  )
}
