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
