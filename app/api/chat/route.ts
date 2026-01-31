import { NextRequest, NextResponse } from 'next/server';
import { getRelevantContext } from '@/lib/rag';
import { generateChatResponse } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get relevant context from the knowledge base
    const context = await getRelevantContext(message);

    // Generate response using DeepSeek via OpenRouter
    const response = await generateChatResponse(message, context, history);

    return NextResponse.json({
      response,
      success: true,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        response: 'I apologize, but I encountered an error. Please try again or contact codeschoolofguam@gmail.com for assistance.',
        success: false,
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Code School of Guam Chatbot API',
  });
}

