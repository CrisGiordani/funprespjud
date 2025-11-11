import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwtToken')?.value

  return NextResponse.json({ token })
}
