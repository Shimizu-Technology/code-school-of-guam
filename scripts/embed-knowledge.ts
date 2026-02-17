/**
 * Knowledge Embedding Script
 * 
 * This script reads all markdown files from data/knowledge/,
 * chunks them, generates embeddings, and uploads to Pinecone.
 * 
 * Run with: npx tsx scripts/embed-knowledge.ts
 * Run with clean slate: npx tsx scripts/embed-knowledge.ts --clean
 */

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables (check .env.local first, then .env)
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log('📋 Loaded environment from .env.local');
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('📋 Loaded environment from .env');
} else {
  console.warn('⚠️  No .env.local or .env file found');
}

const KNOWLEDGE_DIR = path.join(process.cwd(), 'data', 'knowledge');
const INDEX_NAME = process.env.PINECONE_INDEX || 'csg-knowledge';

// Hybrid chunking settings
const MAX_CHUNK_SIZE = 1500; // Max characters before sub-chunking
const MIN_CHUNK_SIZE = 200; // Min characters (combine small sections)
const SUB_CHUNK_OVERLAP = 200; // Overlap when sub-chunking large sections

// Check for --clean flag
const shouldClean = process.argv.includes('--clean');

// Validate required env vars
if (!process.env.PINECONE_API_KEY) {
  console.error('❌ PINECONE_API_KEY is not set. Please add it to .env.local');
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set. Please add it to .env.local');
  process.exit(1);
}

// Initialize clients
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 3,
});

interface ContentChunk {
  text: string;
  sectionTitle: string;
  subIndex: number; // For sub-chunks within a section
}

/**
 * Parse markdown into sections based on H1 and H2 headers
 */
function parseMarkdownSections(content: string): { title: string; content: string }[] {
  const lines = content.split('\n');
  const sections: { title: string; content: string }[] = [];
  
  let currentTitle = 'Introduction';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Match H1 or H2 headers
    const headerMatch = line.match(/^#{1,2}\s+(.+)$/);
    
    if (headerMatch) {
      // Save previous section if it has content
      if (currentContent.length > 0) {
        const text = currentContent.join('\n').trim();
        if (text) {
          sections.push({ title: currentTitle, content: text });
        }
      }
      // Start new section
      currentTitle = headerMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  
  // Don't forget the last section
  if (currentContent.length > 0) {
    const text = currentContent.join('\n').trim();
    if (text) {
      sections.push({ title: currentTitle, content: text });
    }
  }
  
  return sections;
}

/**
 * Sub-chunk a large text with overlap
 */
function subChunkText(text: string, maxSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxSize, text.length);
    
    // Try to break at a sentence or paragraph boundary
    let breakPoint = end;
    if (end < text.length) {
      // Look for paragraph break first
      const paragraphBreak = text.lastIndexOf('\n\n', end);
      if (paragraphBreak > start + maxSize * 0.5) {
        breakPoint = paragraphBreak;
      } else {
        // Look for sentence break (period, question mark, exclamation followed by space)
        const searchText = text.substring(start, end);
        const sentenceMatch = searchText.match(/[.!?]\s+/g);
        if (sentenceMatch) {
          const lastSentenceEnd = searchText.lastIndexOf(sentenceMatch[sentenceMatch.length - 1]);
          if (lastSentenceEnd > maxSize * 0.5) {
            breakPoint = start + lastSentenceEnd + sentenceMatch[sentenceMatch.length - 1].length;
          }
        }
      }
    }
    
    chunks.push(text.slice(start, breakPoint).trim());
    
    // Ensure we always advance by at least 1 character to prevent infinite loop
    const nextStart = breakPoint - overlap;
    start = Math.max(nextStart, start + 1);
    
    // If we've reached the end, break
    if (breakPoint >= text.length) break;
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * Hybrid chunking: split by headers, then handle size constraints
 */
function hybridChunkContent(content: string): ContentChunk[] {
  const sections = parseMarkdownSections(content);
  const chunks: ContentChunk[] = [];
  
  let i = 0;
  while (i < sections.length) {
    const section = sections[i];
    let combinedContent = section.content;
    let combinedTitle = section.title;
    
    // Combine small sections with the next section
    while (
      combinedContent.length < MIN_CHUNK_SIZE && 
      i + 1 < sections.length
    ) {
      i++;
      combinedContent += `\n\n## ${sections[i].title}\n${sections[i].content}`;
      combinedTitle = `${combinedTitle} / ${sections[i].title}`;
    }
    
    // Check if section needs sub-chunking
    if (combinedContent.length > MAX_CHUNK_SIZE) {
      const subChunks = subChunkText(combinedContent, MAX_CHUNK_SIZE, SUB_CHUNK_OVERLAP);
      for (let j = 0; j < subChunks.length; j++) {
        chunks.push({
          text: `## ${combinedTitle}\n\n${subChunks[j]}`,
          sectionTitle: combinedTitle,
          subIndex: j,
        });
      }
    } else {
      // Section is good size, add as-is
      chunks.push({
        text: `## ${combinedTitle}\n\n${combinedContent}`,
        sectionTitle: combinedTitle,
        subIndex: 0,
      });
    }
    
    i++;
  }
  
  return chunks;
}

/**
 * Generate embedding for a text with retry logic
 */
async function generateEmbedding(text: string, retries = 3): Promise<number[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.log(`   ⏳ Retry ${attempt}/${retries} after error...`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * Math.pow(2, attempt - 1))); // Exponential backoff
    }
  }
  throw new Error('Failed after all retries');
}

/**
 * Read all markdown files from the knowledge directory
 */
function readKnowledgeFiles(): { filename: string; content: string }[] {
  const files: { filename: string; content: string }[] = [];

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`Knowledge directory not found: ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const filenames = fs.readdirSync(KNOWLEDGE_DIR);

  for (const filename of filenames) {
    if (filename.endsWith('.md')) {
      const filepath = path.join(KNOWLEDGE_DIR, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      files.push({ filename, content });
    }
  }

  return files;
}

/**
 * Delete all vectors from the index
 */
async function cleanIndex(index: ReturnType<Pinecone['index']>) {
  console.log('🧹 Cleaning index - deleting all existing vectors...');
  try {
    await index.deleteAll();
    console.log('   ✅ All vectors deleted\n');
  } catch (error) {
    console.error('   ❌ Error deleting vectors:', error);
    throw error;
  }
}

/**
 * Main embedding function
 */
async function embedKnowledge() {
  console.log('🚀 Starting knowledge embedding process...\n');

  // Read all knowledge files
  const files = readKnowledgeFiles();
  console.log(`📁 Found ${files.length} knowledge files\n`);

  // Get the index
  const index = pinecone.index(INDEX_NAME);

  // Clean index if --clean flag is passed
  if (shouldClean) {
    await cleanIndex(index);
  }

  // Process each file
  const vectors: {
    id: string;
    values: number[];
    metadata: { 
      text: string; 
      source: string; 
      sectionTitle: string;
      chunkIndex: number;
      subIndex: number;
    };
  }[] = [];

  let totalChunks = 0;

  for (const file of files) {
    console.log(`📄 Processing: ${file.filename}`);

    // Use hybrid chunking (by headers + size constraints)
    const chunks = hybridChunkContent(file.content);
    console.log(`   - Split into ${chunks.length} sections/chunks`);

    // Generate embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const id = `${file.filename.replace('.md', '')}-${chunk.sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${chunk.subIndex}`;

      try {
        const embedding = await generateEmbedding(chunk.text);

        vectors.push({
          id,
          values: embedding,
          metadata: {
            text: chunk.text,
            source: file.filename,
            sectionTitle: chunk.sectionTitle,
            chunkIndex: i,
            subIndex: chunk.subIndex,
          },
        });

        totalChunks++;
        process.stdout.write(`   - Embedded: "${chunk.sectionTitle}" ${chunk.subIndex > 0 ? `(part ${chunk.subIndex + 1})` : ''}\r`);
      } catch (error) {
        console.error(`\n   ❌ Error embedding "${chunk.sectionTitle}": ${error}`);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(`   ✅ Completed ${file.filename}\n`);
  }

  // Upload vectors to Pinecone in batches
  console.log(`\n📤 Uploading ${vectors.length} vectors to Pinecone...`);

  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    console.log(`   - Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
  }

  console.log('\n✅ Knowledge embedding complete!');
  console.log(`   - Total files processed: ${files.length}`);
  console.log(`   - Total chunks embedded: ${totalChunks}`);
  console.log(`   - Pinecone index: ${INDEX_NAME}`);
}

// Run the script
embedKnowledge().catch(console.error);
