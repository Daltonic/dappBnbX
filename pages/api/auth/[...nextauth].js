import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth/next'

export default async function auth(req, res) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            return {
              id: siwe.address,
            }
          }

          return null
        } catch (error) {
          return null
        }
      },
    }),
  ]

  const isDefaultSigninPage = req.method === 'GET' && req.query.nextauth.includes('signin')

  if (isDefaultSigninPage) providers.pop()

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        session.address = token.sub
        session.user.name = token.sub
        session.user.image = 'https://www.fillmurray.com/128/128'
        return session
      },
    },
  })
}
