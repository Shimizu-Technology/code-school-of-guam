// Only reviewed, current sources are eligible for new chatbot embeddings.
// A version filter also prevents old vectors from appearing after source edits.
export const ACTIVE_KNOWLEDGE_VERSION = '2026-09-courses';

export const ACTIVE_KNOWLEDGE_FILES = [
  'about.md',
  'current-offers-2026-09.md',
] as const;
