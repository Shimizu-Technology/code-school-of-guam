export const HAFA_CODE_BASE_URL = "https://code.shimizu-technology.com"

// Matches Hafa Code's STARTER_LINK_MAX_LENGTH so longer user edits still carry over.
export const MAX_ENCODED_URL_LENGTH = 64_000

export interface HafaCodePythonLink {
  url: string
  truncated: boolean
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  if (typeof btoa === "function") {
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  }
  return Buffer.from(bytes).toString("base64url")
}

/**
 * Builds a Hafa Code link preloaded with the given Python code using Hafa Code's
 * `#project=<base64url JSON>` hash format (no login or backend required).
 * Returns `truncated: true` with a plain workspace URL if the encoded link exceeds the cap.
 */
export function buildHafaCodePythonLink(
  code: string,
  options: { title?: string; filename?: string; starterKey?: string } = {},
): HafaCodePythonLink {
  const filename = options.filename ?? "expense_summary.py"
  const title = options.title ?? "Expense summary"
  const payload = {
    title,
    kind: "python",
    entryPath: filename,
    files: [{ path: filename, content: code }],
  }
  const encoded = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const hash = new URLSearchParams()
  hash.set("project", encoded)
  if (options.starterKey) hash.set("starter", options.starterKey)
  const url = `${HAFA_CODE_BASE_URL}/?lang=python#${hash.toString()}`
  if (url.length <= MAX_ENCODED_URL_LENGTH) {
    return { url, truncated: false }
  }
  return { url: `${HAFA_CODE_BASE_URL}/?lang=python`, truncated: true }
}

export function buildHafaCodePythonUrl(
  code: string,
  options: { title?: string; filename?: string; starterKey?: string } = {},
): string {
  return buildHafaCodePythonLink(code, options).url
}
