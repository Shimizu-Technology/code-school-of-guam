import { NextRequest, NextResponse } from 'next/server';
import { getRelevantContext } from '@/lib/rag';
import { generateChatResponse } from '@/lib/openrouter';

// Simple in-memory rate limiter with periodic cleanup
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute
const RATE_WINDOW_SECONDS = Math.floor(RATE_WINDOW / 1000);
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up every 5 minutes
let lastCleanup = Date.now();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent') || 'unknown-ua';

  // x-forwarded-for can be a comma-separated list: client, proxy1, proxy2
  const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp?.trim() || 'unknown-ip';
  return `${clientIp}:${userAgent.slice(0, 80)}`;
}

function isRateLimitedLocal(clientId: string): boolean {
  const now = Date.now();

  // Periodic cleanup of stale entries
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    rateLimitMap.forEach((entry, key) => {
      if (now > entry.resetTime) rateLimitMap.delete(key);
    });
    lastCleanup = now;
  }

  const entry = rateLimitMap.get(clientId);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function buildDistributedRateLimitKey(clientId: string): string {
  const safeId = clientId.replace(/[^a-zA-Z0-9:_-]/g, '_').slice(0, 180);
  return `chat-rate-limit:${safeId}`;
}

async function isRateLimitedDistributed(clientId: string): Promise<boolean | null> {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // No distributed store configured - caller can fall back to local limiter.
  if (!restUrl || !restToken) {
    return null;
  }

  try {
    const key = buildDistributedRateLimitKey(clientId);
    const response = await fetch(`${restUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${restToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, RATE_WINDOW_SECONDS, 'NX'],
      ]),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Distributed rate limiter request failed:', response.status);
      return null;
    }

    const data = (await response.json()) as Array<{ result?: unknown; error?: string }>;
    const countEntry = Array.isArray(data) ? data[0] : undefined;

    if (!countEntry || countEntry.error) {
      console.error('Distributed rate limiter invalid response:', countEntry?.error);
      return null;
    }

    const count = Number(countEntry.result);
    if (!Number.isFinite(count)) {
      console.error('Distributed rate limiter count is not numeric');
      return null;
    }

    return count > RATE_LIMIT;
  } catch (error) {
    console.error('Distributed rate limiter error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by client identifier
    const clientId = getClientIdentifier(request);
    const distributedRateLimited = await isRateLimitedDistributed(clientId);
    const isLimited = distributedRateLimited ?? isRateLimitedLocal(clientId);
    if (isLimited) {
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
    const sanitizedHistory: ChatMessage[] = history
      .filter(
        (msg: unknown): msg is ChatMessage =>
          typeof msg === 'object' &&
          msg !== null &&
          'content' in msg &&
          'role' in msg &&
          typeof (msg as { content?: unknown }).content === 'string' &&
          ((msg as { role?: unknown }).role === 'user' ||
            (msg as { role?: unknown }).role === 'assistant')
      )
      .map((msg) => ({
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
