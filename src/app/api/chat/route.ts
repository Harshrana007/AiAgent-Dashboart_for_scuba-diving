import { NextRequest, NextResponse } from 'next/server';
import AgentService from '@/services/AgentService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, pageUrl, productContext, conversationId } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, message' },
        { status: 400 }
      );
    }

    const response = await AgentService.chat({
      sessionId,
      message,
      pageUrl,
      productContext,
      conversationId
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
