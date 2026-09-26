const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat'; // DeepSeek V3

// System prompt for the Code School of Guam chatbot
const SYSTEM_PROMPT = `You are a helpful assistant for Code School of Guam, which offers a full coding bootcamp and is preparing shorter focused courses.

Your role is to:
- Answer questions about the program, curriculum, pricing, admissions, and policies
- Help prospective students distinguish the full bootcamp from focused courses
- Provide accurate information based on the knowledge base provided
- Be friendly, encouraging, and professional
- Direct prospective students to the correct offer page and contact channel

Formatting rules:
- NEVER use emoji characters in your responses. Use plain text only.
- Use markdown formatting: **bold** for emphasis, [text](url) for links, numbered/bulleted lists for structure.
- Keep responses concise and well-structured. Use short paragraphs.

Current offer facts (September 2026):
- The March 2026 full bootcamp cohort began March 2 and is closed to new students. Do not infer its actual completion date. Its $7,500 tuition was for that cohort. No date, price, schedule, financing terms, or internship arrangement has been announced for the next full cohort. Full bootcamp information: https://codeschoolofguam.com/programs ; updates: https://codeschoolofguam.com/interest
- Python Fundamentals is a separate three-week beginner course being prepared for a small invited group during the first three weeks of December 2026. The public cannot enroll in that pilot. Its page has an updates list for a later public run: https://codeschoolofguam.com/courses/python-fundamentals
- Python Fundamentals uses short lessons, browser coding in Hafa Code, an expense-summary project, one private Zoom hour with Leon in each of three weeks, and course questions through CSG Learn. Exact pilot dates and student terms are not public yet. Do not quote a pilot or future public price.
- Other focused courses are planned, not scheduled or sold. See https://codeschoolofguam.com/courses . Completing focused courses does not equal graduating from the full bootcamp.
- Do not claim that a future cohort includes a specific weekly schedule, guaranteed internship, job placement, lifetime access, Cursor license, payment plan, or financing partnership. Older knowledge may describe the March 2026 cohort and must not be presented as a current public offer.
- Written access, meeting, and refund terms must be reviewed before payment for a new offer. For offer-specific policies or anything unknown, contact codeschoolofguam@gmail.com or +1 (671) 483-0219.

If you don't know the answer or it's not in the provided context, politely say so and suggest contacting the school directly.

Always be concise but helpful. Distinguish an invited pilot, a future public updates list, and the closed 2026 full bootcamp cohort. Do not infer a launch date, price, or policy from an older document.`;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

/**
 * Generate a chat response using OpenRouter/DeepSeek
 */
export async function generateChatResponse(
  userMessage: string,
  context: string,
  conversationHistory: Message[] = []
): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not set');
    return 'I apologize, but the chat service is not configured. Please contact codeschoolofguam@gmail.com for assistance.';
  }

  // Sanitize conversation history — only allow user/assistant roles
  const sanitizedHistory = (Array.isArray(conversationHistory) ? conversationHistory : [])
    .filter((msg): msg is Message =>
      msg != null &&
      typeof msg.content === 'string' &&
      (msg.role === 'user' || msg.role === 'assistant')
    )
    .slice(-10); // Keep last 10 messages max

  // Build the messages array
  const messages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...sanitizedHistory,
    {
      role: 'user',
      content: `Context from knowledge base:
${context}

User question: ${userMessage}

Please answer using only the context above for Code School of Guam-specific facts (pricing, dates, policies, schedule, admissions, contact info, internship details). If the context does not contain enough information, clearly say you do not have that specific information and direct the user to contact Code School of Guam directly for confirmation.`,
    },
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://codeschoolofguam.com',
        'X-Title': 'Code School of Guam Chatbot',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again or contact codeschoolofguam@gmail.com for assistance.';
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'I apologize, but I encountered an error. Please try again or contact codeschoolofguam@gmail.com for assistance.';
  }
}
