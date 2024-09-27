'use server'
import { env } from '@saas/env'
import { redirect } from 'next/navigation'

console.log(env.GITHUB_OAUTH_CLIENT_ID)
console.log(env.GITHUB_OAUTH_REDIRECT_URI)

export async function signInWithGithub() {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')
  githubSignInURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInURL.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_REDIRECT_URI,
  )
  githubSignInURL.searchParams.set('scope', 'user')
  redirect(githubSignInURL.toString())
}
