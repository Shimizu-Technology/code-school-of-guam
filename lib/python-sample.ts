// Shared non-client sample so Server Components (like /courses/python-fundamentals
// and the pre-highlighted hero code) and Client Components (HeroEditor) read the
// exact same Python source string.
export const DEFAULT_PYTHON_CODE = [
  "expenses = {",
  '    "Food": 61,',
  '    "Transport": 48,',
  '    "Supplies": 9,',
  "}",
  "budget = 120",
  "",
  "total = sum(expenses.values())",
  'print(f"Total: ${total}")',
  "",
  "for item, cost in expenses.items():",
  '    print(f"{item}: ${cost}")',
  "",
  "left = budget - total",
  "if left >= 0:",
  '    print(f"Under budget by ${left}")',
].join("\n")

export const EDITOR_LINES: readonly string[] = DEFAULT_PYTHON_CODE.split("\n")

export const EDITOR_OUTPUT = [
  "Total: $118",
  "Food: $61",
  "Transport: $48",
  "Supplies: $9",
  "Under budget by $2",
] as const

export const HERO_STARTER_KEY = "csg-site-expense-summary"

export const HERO_FILENAME = "expense_summary.py"
