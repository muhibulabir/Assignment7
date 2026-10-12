import { getAuth } from '../../../../lib/auth'

export const runtime = 'nodejs'

async function handleRequest(request: Request) {
  const auth = await getAuth()
  return auth.handler(request)
}

export { handleRequest as GET, handleRequest as POST }
