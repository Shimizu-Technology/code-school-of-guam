import { hangingIndentCh, highlightPythonLines } from "@/lib/python-highlight"

/**
 * Server Component: the hero's Python sample, syntax-highlighted at build time with
 * the same Lezer parser, tag map and CSS as the lazily loaded CodeMirror editor. It
 * ships as plain HTML, so the first paint has colors with zero editor JavaScript.
 * Line boxes, gutter, padding and soft-wrap hanging indents mirror CodeMirror's, so
 * swapping in the live editor causes no layout shift.
 */
export function PythonCodeStatic({ code }: { code: string }) {
  const lines = highlightPythonLines(code)
  const sourceLines = code.split("\n")
  return (
    <pre className="home-code-static">
      {lines.map((spans, index) => (
        <span key={index} className="home-code-row">
          <span className="home-code-num" aria-hidden="true">
            {index + 1}
          </span>
          <span
            className="home-code-line"
            style={{ "--hang": `${hangingIndentCh(sourceLines[index] ?? "")}ch` } as React.CSSProperties}
          >
            {spans.length
              ? spans.map((span, spanIndex) =>
                  span.className ? (
                    <span key={spanIndex} className={span.className}>
                      {span.text}
                    </span>
                  ) : (
                    span.text
                  ),
                )
              : "\n"}
          </span>
        </span>
      ))}
    </pre>
  )
}
