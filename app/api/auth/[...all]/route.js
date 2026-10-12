import { getAuth } from '../../../../lib/auth'

export const runtime = 'nodejs'

async function handleRequest(request) {
  const auth = await getAuth()
  return auth.handler(request)
}

export { handleRequest as GET, handleRequest as POST }
