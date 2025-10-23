import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Get the code and state from query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=missing_code', request.url)
      );
    }

    // Just redirect back to the browser - backend handles everything else
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=oauth_failed', request.url)
    );
  }
}