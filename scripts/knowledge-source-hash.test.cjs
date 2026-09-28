const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

function loadTs(relativePath) {
  const filename = path.join(__dirname, '..', relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output)(require, module, module.exports);
  return module.exports;
}

const { knowledgeChunkId, knowledgeSourceHash, knowledgeUploadId } = loadTs('lib/knowledge-source-hash.ts');
const { ACTIVE_KNOWLEDGE_FILES, ACTIVE_KNOWLEDGE_SOURCE_SHA256, ACTIVE_KNOWLEDGE_VERSION, ACTIVE_KNOWLEDGE_MANIFEST_ID } = loadTs('lib/active-knowledge.ts');
const files = ACTIVE_KNOWLEDGE_FILES.map((filename) => ({ filename, content: fs.readFileSync(path.join(__dirname, '..', 'data', 'knowledge', filename), 'utf8') }));

test('the active source is the exact reviewed bundle', () => {
  assert.equal(knowledgeSourceHash(files), ACTIVE_KNOWLEDGE_SOURCE_SHA256);
  assert.equal(ACTIVE_KNOWLEDGE_MANIFEST_ID, `${ACTIVE_KNOWLEDGE_VERSION}::${ACTIVE_KNOWLEDGE_SOURCE_SHA256}::manifest`);
});

test('overlapping attempts with different source revisions cannot share a manifest ID', () => {
  const staleFiles = files.map((file, index) => index === 0 ? { ...file, content: `${file.content}\nOld offer` } : file);
  const staleHash = knowledgeSourceHash(staleFiles);
  assert.notEqual(staleHash, ACTIVE_KNOWLEDGE_SOURCE_SHA256);
  assert.notEqual(`${ACTIVE_KNOWLEDGE_VERSION}::${staleHash}::manifest`, ACTIVE_KNOWLEDGE_MANIFEST_ID);
  assert.equal(knowledgeSourceHash(files), knowledgeSourceHash(files.map((file) => ({ ...file }))));
});

test('same-source uploads finishing in reverse order publish one complete corpus identity', () => {
  // Both attempts passed the initial missing-manifest check. Their embedding
  // requests can finish in either order, but reviewed text and IDs must agree.
  const attempts = [files, files.map((file) => ({ ...file }))].map((snapshot) => {
    const uploadId = knowledgeUploadId(knowledgeSourceHash(snapshot));
    const chunks = snapshot.map((file, index) => ({
      id: knowledgeChunkId(ACTIVE_KNOWLEDGE_VERSION, uploadId, file.filename, index, 'Introduction', 0),
      text: file.content,
    }));
    return { uploadId, chunks, manifest: { uploadId, sourceHash: ACTIVE_KNOWLEDGE_SOURCE_SHA256, totalVectors: chunks.length } };
  });

  const records = new Map();
  for (const attempt of attempts.slice().reverse()) {
    for (const chunk of attempt.chunks) records.set(chunk.id, chunk.text);
    records.set(ACTIVE_KNOWLEDGE_MANIFEST_ID, attempt.manifest);
  }

  assert.deepEqual(attempts[0], attempts[1]);
  assert.deepEqual(records.get(ACTIVE_KNOWLEDGE_MANIFEST_ID), attempts[0].manifest);
  for (const chunk of attempts[0].chunks) assert.equal(records.get(chunk.id), chunk.text);
});
