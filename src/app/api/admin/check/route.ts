import { NextRequest, NextResponse } from 'next/server';
import { createPublicApiHandler, addSecurityHeaders } from '@/lib/api-handler';

// Handler for checking admin status
const adminCheckHandler = createPublicApiHandler(
  async ({ isAdmin }) => {
    return NextResponse.json(
      { 
        isAdmin,
        message: isAdmin ? 'Admin authenticated' : 'Not authenticated as admin' 
      }
    );
  },
  { allowedMethods: ['GET'] }
);

// Export the handler for the GET method
export async function GET(request: NextRequest) {
  return adminCheckHandler(request);
}
