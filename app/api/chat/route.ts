import { NextRequest, NextResponse } from 'next/server';
import { getRelevantContext } from '@/lib/rag';
import { generateChatResponse } from '@/lib/openrouter';

// Simple in-memory rate limiter with periodic cleanup
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up every 5 minutes
let lastCleanup = Date.now();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup of stale entries
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetTime) rateLimitMap.delete(key);
    }
    lastCleanup = now;
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Reject overly long messages
    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }

    // Validate history is an array
    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: 'Invalid history format' },
        { status: 400 }
      );
    }

    // Sanitize history: validate and limit content length
    const sanitizedHistory = history
      .filter((msg: { role?: string; content?: string }) =>
        msg && typeof msg.content === 'string' &&
        (msg.role === 'user' || msg.role === 'assistant')
      )
      .map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content.slice(0, 2000),
      }))
      .slice(-10);

    // Get relevant context from the knowledge base
    const context = await getRelevantContext(message);

    // Generate response using DeepSeek via OpenRouter
    const response = await generateChatResponse(message, context, sanitizedHistory);

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
