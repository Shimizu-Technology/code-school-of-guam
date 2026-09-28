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

const { knowledgeSourceHash } = loadTs('lib/knowledge-source-hash.ts');
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
