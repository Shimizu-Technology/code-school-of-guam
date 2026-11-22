export type Token = readonly [kind: "" | "k" | "s" | "n" | "f", text: string]

// Shared non-client sample so Server Components (like /courses/python-fundamentals)
// and Client Components (HeroEditor) read the exact same Python source string.
// Every line is short enough to fit a 390px phone without scrolling.
export const EDITOR_LINES: readonly (readonly Token[])[] = [
  [["", "expenses = {"]],
  [["", "    "], ["s", '"Food"'], ["", ": "], ["n", "61"], ["", ","]],
  [["", "    "], ["s", '"Transport"'], ["", ": "], ["n", "48"], ["", ","]],
  [["", "    "], ["s", '"Supplies"'], ["", ": "], ["n", "9"], ["", ","]],
  [["", "}"]],
  [["", "budget = "], ["n", "120"]],
  [],
  [["", "total = "], ["f", "sum"], ["", "(expenses."], ["f", "values"], ["", "())"]],
  [["f", "print"], ["", "("], ["s", 'f"Total: ${total}"'], ["", ")"]],
  [],
  [["k", "for"], ["", " item, cost "], ["k", "in"], ["", " expenses."], ["f", "items"], ["", "():"]],
  [["", "    "], ["f", "print"], ["", "("], ["s", 'f"{item}: ${cost}"'], ["", ")"]],
  [],
  [["", "left = budget - total"]],
  [["k", "if"], ["", " left >= "], ["n", "0"], ["", ":"]],
  [["", "    "], ["f", "print"], ["", "("], ["s", 'f"Under budget by ${left}"'], ["", ")"]],
]

export const DEFAULT_PYTHON_CODE = EDITOR_LINES.map((line) =>
  line.map(([, text]) => text).join("")
).join("\n")

export const EDITOR_OUTPUT = [
  "Total: $118",
  "Food: $61",
  "Transport: $48",
  "Supplies: $9",
  "Under budget by $2",
] as const

export const HERO_STARTER_KEY = "csg-site-expense-summary"
