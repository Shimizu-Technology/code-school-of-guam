/**
 * Knowledge Embedding Script
 * 
 * This script reads all markdown files from data/knowledge/,
 * chunks them, generates embeddings, and uploads to Pinecone.
 * 
 * Run with: npx tsx scripts/embed-knowledge.ts
 * Each reviewed source bundle uses one content-derived upload ID. Readers see
 * only the complete upload named by the manifest; concurrent attempts for the
 * same bundle write the same chunk and manifest identities.
 */

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ACTIVE_KNOWLEDGE_FILES, ACTIVE_KNOWLEDGE_MANIFEST_ID, ACTIVE_KNOWLEDGE_SOURCE_SHA256, ACTIVE_KNOWLEDGE_VERSION } from '../lib/active-knowledge';
import { knowledgeChunkId, knowledgeSourceHash, knowledgeUploadId } from '../lib/knowledge-source-hash';

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

if (process.argv.includes('--clean')) {
  throw new Error('--clean would delete knowledge from other versions. Run without it.');
}

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

  const filenames = ACTIVE_KNOWLEDGE_FILES;

  for (const filename of filenames) {
    const filepath = path.join(KNOWLEDGE_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    files.push({ filename, content });
  }

  return files;
}

/**
 * Main embedding function
 */
async function embedKnowledge() {
  console.log('🚀 Starting knowledge embedding process...\n');

  // Read all knowledge files
  const files = readKnowledgeFiles();
  const sourceHash = knowledgeSourceHash(files);
  if (sourceHash !== ACTIVE_KNOWLEDGE_SOURCE_SHA256) {
    throw new Error('Knowledge files differ from the reviewed source hash. Update the version and source hash before uploading.');
  }
  console.log(`📁 Found ${files.length} knowledge files\n`);

  // Get the index
  const index = pinecone.index(INDEX_NAME);

  // Published versions are immutable. The reviewed source hash is the upload
  // identity, so two attempts that pass this check for the same bundle converge
  // on identical chunk IDs and manifest metadata regardless of write order.
  const manifest = await index.fetch([ACTIVE_KNOWLEDGE_MANIFEST_ID]);
  if (manifest.records?.[ACTIVE_KNOWLEDGE_MANIFEST_ID]) {
    throw new Error(`Knowledge version ${ACTIVE_KNOWLEDGE_VERSION} is already published. Bump the version before uploading.`);
  }
  const uploadId = knowledgeUploadId(sourceHash);

  // Process each file
  const vectors: {
    id: string;
    values: number[];
    metadata: { 
      text: string; 
      source: string; 
      sectionTitle: string;
      knowledgeVersion: string;
      kind: string;
      uploadId: string;
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
      const id = knowledgeChunkId(ACTIVE_KNOWLEDGE_VERSION, uploadId, file.filename, i, chunk.sectionTitle, chunk.subIndex);

      try {
        const embedding = await generateEmbedding(chunk.text);

        vectors.push({
          id,
          values: embedding,
          metadata: {
            text: chunk.text,
            source: file.filename,
            knowledgeVersion: ACTIVE_KNOWLEDGE_VERSION,
            kind: 'chunk',
            uploadId,
            sectionTitle: chunk.sectionTitle,
            chunkIndex: i,
            subIndex: chunk.subIndex,
          },
        });

        totalChunks++;
        process.stdout.write(`   - Embedded: "${chunk.sectionTitle}" ${chunk.subIndex > 0 ? `(part ${chunk.subIndex + 1})` : ''}\r`);
      } catch (error) {
        console.error(`\n   ❌ Error embedding "${chunk.sectionTitle}": ${error}`);
        throw error;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(`   ✅ Completed ${file.filename}\n`);
  }

  if (vectors.length === 0) {
    throw new Error('No knowledge vectors generated; refusing to replace the active version.');
  }

  // Publish the manifest only after all batches succeed. Readers use the
  // vetted fallback until the manifest exists, so a partial upload is hidden.
  console.log(`\n📤 Uploading ${vectors.length} vectors to Pinecone...`);

  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    console.log(`   - Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
  }

  // Pinecone may acknowledge writes before every chunk is query-visible.
  // A manifest makes this upload public, so wait until a filtered query sees
  // all of this bundle's chunk IDs. Overlapping attempts for the same reviewed
  // bundle have the same IDs and content, so either complete attempt may publish.
  if (vectors.length > 10000) {
    throw new Error('Knowledge upload exceeds the query visibility check limit; refusing to publish.');
  }
  const expectedIds = new Set(vectors.map((vector) => vector.id));
  let visible = false;
  for (let attempt = 1; attempt <= 10; attempt++) {
    const results = await index.query({
      vector: vectors[0].values,
      topK: vectors.length,
      includeMetadata: false,
      filter: { knowledgeVersion: { $eq: ACTIVE_KNOWLEDGE_VERSION }, kind: { $eq: 'chunk' }, uploadId: { $eq: uploadId } },
    });
    const visibleIds = new Set((results.matches ?? []).map((match) => match.id));
    visible = visibleIds.size === expectedIds.size && [...expectedIds].every((id) => visibleIds.has(id));
    if (visible) break;
    console.log(`   - Query sees ${visibleIds.size}/${expectedIds.size} chunks; retry ${attempt}/10`);
    if (attempt < 10) await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (!visible) throw new Error('Knowledge chunks are not all query-visible; refusing to publish.');

  await index.upsert([{
    id: ACTIVE_KNOWLEDGE_MANIFEST_ID,
    values: vectors[0].values,
    metadata: { knowledgeVersion: ACTIVE_KNOWLEDGE_VERSION, kind: 'manifest', uploadId, totalVectors: vectors.length, sourceHash },
  }]);
  console.log(`   - Published complete version ${ACTIVE_KNOWLEDGE_VERSION}`);

  console.log('\n✅ Knowledge embedding complete!');
  console.log(`   - Total files processed: ${files.length}`);
  console.log(`   - Total chunks embedded: ${totalChunks}`);
  console.log(`   - Pinecone index: ${INDEX_NAME}`);
}

// Run the script
embedKnowledge().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
