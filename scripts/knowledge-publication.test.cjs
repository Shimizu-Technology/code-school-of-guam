const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '..', 'lib', 'knowledge-publication.ts'), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleUnderTest = { exports: {} };
new Function('module', 'exports', output)(moduleUnderTest, moduleUnderTest.exports);
const { publishManifestWhenVisible } = moduleUnderTest.exports;

test('an incomplete overlapping upload cannot publish or become retrievable', async () => {
  const chunks = new Map([
    ['a', { uploadId: 'reviewed-source', text: 'first lesson' }],
    ['old', { uploadId: 'older-source', text: 'stale offer' }],
  ]);
  let manifest = null;
  const visible = async () => [...chunks].filter(([, chunk]) => chunk.uploadId === 'reviewed-source').map(([id]) => id);
  const publish = async () => { manifest = { uploadId: 'reviewed-source' }; };
  const retrieve = () => manifest
    ? [...chunks.values()].filter((chunk) => chunk.uploadId === manifest.uploadId).map((chunk) => chunk.text)
    : [];

  await assert.rejects(
    publishManifestWhenVisible(['a', 'b'], visible, publish, { maxAttempts: 1 }),
    /not all query-visible/
  );
  assert.equal(manifest, null);
  assert.deepEqual(retrieve(), []);

  chunks.set('b', { uploadId: 'reviewed-source', text: 'second lesson' });
  await publishManifestWhenVisible(['a', 'b'], visible, publish, { maxAttempts: 1 });
  assert.deepEqual(manifest, { uploadId: 'reviewed-source' });
  assert.deepEqual(retrieve(), ['first lesson', 'second lesson']);
});

test('a manifest is not published when visibility reports the wrong IDs', async () => {
  let published = false;
  await assert.rejects(
    publishManifestWhenVisible(['a', 'b'], async () => ['a', 'other'], async () => { published = true; }, { maxAttempts: 1 }),
    /not all query-visible/
  );
  assert.equal(published, false);
});
