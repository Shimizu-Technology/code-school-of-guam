import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

// Lazy initialization of clients
let pinecone: Pinecone | null = null;
let openai: OpenAI | null = null;

function getPinecone(): Pinecone {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
}

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return openai;
}

const INDEX_NAME = process.env.PINECONE_INDEX || 'csg-knowledge';

/**
 * Generate embeddings for a text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAI();
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * Query Pinecone for relevant knowledge chunks
 */
export async function queryKnowledge(
  query: string,
  topK: number = 5
): Promise<string[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Get the index
    const client = getPinecone();
    const index = client.index(INDEX_NAME);

    // Query Pinecone
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    // Extract and return the text content from results
    const chunks: string[] = [];
    for (const match of results.matches || []) {
      if (match.metadata?.text) {
        chunks.push(match.metadata.text as string);
      }
    }

    return chunks;
  } catch (error) {
    console.error('Error querying knowledge base:', error);
    return [];
  }
}

/**
 * Build context string from retrieved chunks
 */
export function buildContext(chunks: string[]): string {
  if (chunks.length === 0) {
    return 'No relevant information found in the knowledge base.';
  }

  return chunks
    .map((chunk, index) => `[${index + 1}] ${chunk}`)
    .join('\n\n');
}

/**
 * Main RAG function: query and build context
 */
export async function getRelevantContext(query: string): Promise<string> {
  const chunks = await queryKnowledge(query);
  return buildContext(chunks);
}

