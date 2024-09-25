'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import githubIcon from '@/assets/github.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { singInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const router = useRouter()
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    singInWithEmailAndPassword,
    () => {
      console.log('entrou')
      router.push('/')
    },
  )

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {success === false && message && (
          <Alert variant={'destructive'}>
            <AlertTriangle className='size-4' />
            <AlertTitle>Sign-in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className='space-y-1'>
          <Label htmlFor='email'>E-mail</Label>
          <Input name='email' type='email' id='email' />
          {errors?.email && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='password'>Password</Label>
          <Input name='password' type='password' id='password' />
          {errors?.password && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>
              {errors.password[0]}
            </p>
          )}

          <Link
            href={'/auth/forgot-password'}
            className='text-xs font-medium text-muted-foreground hover:underline'
          >
            Forgot your password?
          </Link>
        </div>

        <Button disabled={isPending} type='submit' className='w-full'>
          {isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <span>Sign in with e-mail</span>
          )}
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
            alt=''
          />
          Sign in with GitHub
        </Button>
      </form>
    </>
  )
}
