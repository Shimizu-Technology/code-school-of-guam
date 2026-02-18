const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat'; // DeepSeek V3

// System prompt for the Code School of Guam chatbot
const SYSTEM_PROMPT = `You are a helpful assistant for Code School of Guam, Guam's first coding bootcamp. 

Your role is to:
- Answer questions about the program, curriculum, pricing, admissions, and policies
- Help prospective students understand what the bootcamp offers
- Provide accurate information based on the knowledge base provided
- Be friendly, encouraging, and professional
- Guide users to apply if they're interested (application link: https://forms.gle/8vNXoqxCimxjfXkU6)

Formatting rules:
- NEVER use emoji characters in your responses. Use plain text only.
- Use markdown formatting: **bold** for emphasis, [text](url) for links, numbered/bulleted lists for structure.
- Keep responses concise and well-structured. Use short paragraphs.

Important details to remember:
- Tuition is $7,500 (reduced from $10,000)
- Program is 22 weeks: 5 weeks pre-work + 17 weeks live classes
- Classes are Monday-Thursday, 6:00pm-9:00pm Guam time
- Maximum 10 students per cohort
- Technologies taught: Ruby, Rails, React, Python, AI Engineering (OpenAI, RAG, Vector DBs)
- Next cohort starts March 2, 2026
- Contact: codeschoolofguam@gmail.com or +1 (671) 483-0219
- The internship is optional and unpaid (experience-focused), with separate paid opportunities (TA positions and junior dev contracts) for top performers
- Payment plans available: pay in full, 4-8 month installments, or PFC Finance partnership

If you don't know the answer or it's not in the provided context, politely say so and suggest contacting the school directly.

Always be concise but helpful. If the question is about applying, encourage them to apply!`;

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

