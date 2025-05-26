import { NextRequest, NextResponse } from 'next/server';
import { createApiHandler, addSecurityHeaders } from '@/lib/api-handler';
import { getSessionData, setSessionData } from '@/lib/session-metadata-r2';

interface CustomNameRequest {
  sessionId: string;
  customName: string;
}

// Handler for setting custom animation name (admin only)
const customNameHandler = createApiHandler(
  async ({ request, isAdmin }) => {
    // Only allow admin users
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    let body: CustomNameRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { sessionId, customName } = body;
    
    if (!sessionId || !customName || customName.trim() === '') {
      return NextResponse.json(
        { error: 'Session ID and custom name are required' },
        { status: 400 }
      );
    }
    
    try {
      // Validate custom name
      const nameRegex = /^[a-zA-Z0-9-_]+$/;
      if (!nameRegex.test(customName)) {
        return NextResponse.json(
          { error: 'Custom name can only contain letters, numbers, hyphens and underscores' },
          { status: 400 }
        );
      }
      
      // Get the session data and update it with custom name
      const sessionData = await getSessionData(sessionId);
      sessionData.customName = customName;
      
      // Save updated session data
      await setSessionData(sessionId, sessionData);
      
      const response = NextResponse.json({
        success: true,
        customName,
        sessionId
      });
      
      return addSecurityHeaders(response);
    } catch (error) {
      console.error('Error updating custom name:', error);
      return NextResponse.json(
        { error: 'Failed to update custom name' },
        { status: 500 }
      );
    }
  },
  { allowedMethods: ['POST'] }
);

// Export the handler for the POST method
export async function POST(request: NextRequest) {
  return customNameHandler(request);
}
