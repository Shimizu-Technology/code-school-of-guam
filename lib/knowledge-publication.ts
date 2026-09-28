export async function publishManifestWhenVisible(
  expectedIds: readonly string[],
  getVisibleIds: () => Promise<readonly string[]>,
  publishManifest: () => Promise<void>,
  options: { maxAttempts?: number; wait?: () => Promise<void>; onRetry?: (visible: number, attempt: number) => void } = {}
): Promise<void> {
  if (expectedIds.length === 0 || expectedIds.length > 10000) {
    throw new Error('Knowledge upload must contain between 1 and 10000 chunks; refusing to publish.');
  }

  const expected = new Set(expectedIds);
  const maxAttempts = options.maxAttempts ?? 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const visible = new Set(await getVisibleIds());
    if (visible.size === expected.size && Array.from(expected).every((id) => visible.has(id))) {
      await publishManifest();
      return;
    }
    options.onRetry?.(visible.size, attempt);
    if (attempt < maxAttempts) await (options.wait?.() ?? new Promise((resolve) => setTimeout(resolve, 2000)));
  }

  throw new Error('Knowledge chunks are not all query-visible; refusing to publish.');
}
