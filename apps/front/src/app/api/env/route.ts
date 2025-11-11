import { NextResponse } from 'next/server'

export async function GET() {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || 'prd'

  return NextResponse.json({ appEnv })
}

