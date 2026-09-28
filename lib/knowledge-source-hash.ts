import { createHash } from 'node:crypto';

export function knowledgeSourceHash(files: readonly { filename: string; content: string }[]): string {
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(file.filename);
    hash.update('\0');
    hash.update(file.content);
    hash.update('\0');
  }
  return hash.digest('hex');
}

// A reviewed source bundle is the upload identity. Concurrent attempts for the
// same bundle therefore write the same Pinecone IDs instead of competing to
// publish different upload IDs under one manifest.
export function knowledgeUploadId(sourceHash: string): string {
  return sourceHash;
}

export function knowledgeChunkId(
  version: string,
  uploadId: string,
  filename: string,
  chunkIndex: number,
  sectionTitle: string,
  subIndex: number
): string {
  return `${version}::${uploadId}::${filename.replace('.md', '')}-${chunkIndex}-${sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${subIndex}`;
}
