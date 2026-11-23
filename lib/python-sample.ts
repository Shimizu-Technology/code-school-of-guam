// Shared non-client sample so Server Components (like /courses/python-fundamentals
// and the pre-highlighted hero code) and Client Components (HeroEditor) read the
// exact same Python source string.
export const DEFAULT_PYTHON_CODE = [
  "expenses = {",
  "    \"Food\": 61,",
  "    \"Transport\": 48,",
  "    \"Supplies\": 9,",
  "}",
  "budget = 120",
  "",
  "costs = expenses.values()",
  "total = sum(costs)",
  "print(f\"Total: ${total}\")",
  "",
  "entries = expenses.items()",
  "for item, cost in entries:",
  "    print(f\"{item}: ${cost}\")",
  "",
  "left = budget - total",
  "if left >= 0:",
  "    label = \"Under budget by\"",
  "    print(label, f\"${left}\")",
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

export const CLEAR_PYTHON_CODE = "# Write your Python here\n"

export interface PythonExample {
  filename: string
  title: string
  caption: string
  starterKey: string
  code: string
  /** A distinctive last output line, used to verify the real Python run. */
  lastOutput: string
}

export const PYTHON_EXAMPLES: readonly PythonExample[] = [
  {
    filename: HERO_FILENAME,
    title: "Expense summary",
    caption: "Dictionaries, loops + if",
    starterKey: HERO_STARTER_KEY,
    code: DEFAULT_PYTHON_CODE,
    lastOutput: "Under budget by $2",
  },
  {
    filename: "guam_weather.py",
    title: "Guam weather",
    caption: "Conversions + text charts · sample data",
    starterKey: "csg-site-guam-weather",
    code: [
      "print(\"Guam: sample data\")",
      "for temp_f in [77, 86, 95]:",
      "    temp_c = temp_f - 32",
      "    temp_c *= 5 / 9",
      "    print(",
      "        f\"{temp_f}°F =\",",
      "        f\"{temp_c:.0f}°C\",",
      "    )",
      "",
      "print(\"Rain: █ = 50 mm\")",
      "rain = {",
      "    \"Jan\": 100,",
      "    \"Jun\": 150,",
      "    \"Sep\": 350,",
      "}",
      "months = rain.items()",
      "for month, mm in months:",
      "    bars = \"█\" * (mm // 50)",
      "    print(",
      "        month, bars, mm, \"mm\"",
      "    )",
    ].join("\n"),
    lastOutput: "Sep ███████ 350 mm",
  },
  {
    filename: "tip_split.py",
    title: "Split a restaurant bill",
    caption: "Arithmetic + formatted numbers",
    starterKey: "csg-site-tip-split",
    code: [
      "bill = 84",
      "tip_percent = 18",
      "people = 3",
      "",
      "tip = bill * tip_percent",
      "tip /= 100",
      "total = bill + tip",
      "each = total / people",
      "share = f\"${each:.2f}\"",
      "print(f\"Bill: ${bill:.2f}\")",
      "print(f\"Tip: ${tip:.2f}\")",
      "print(\"Each pays:\", share)",
    ].join("\n"),
    lastOutput: "Each pays: $33.04",
  },
  {
    filename: "fizzbuzz.py",
    title: "FizzBuzz",
    caption: "Loops, remainders + conditions",
    starterKey: "csg-site-fizzbuzz",
    code: [
      "for number in range(1, 16):",
      "    if number % 15 == 0:",
      "        print(\"FizzBuzz\")",
      "    elif number % 3 == 0:",
      "        print(\"Fizz\")",
      "    elif number % 5 == 0:",
      "        print(\"Buzz\")",
      "    else:",
      "        print(number)",
    ].join("\n"),
    lastOutput: "FizzBuzz",
  },
  {
    filename: "bubble_sort.py",
    title: "Bubble sort",
    caption: "Nested loops + swapping values",
    starterKey: "csg-site-bubble-sort",
    code: [
      "row = [5, 1, 4, 2, 8]",
      "print(\"Start:\", row)",
      "last = len(row) - 1",
      "ends = range(last, 0, -1)",
      "for end in ends:",
      "    for pos in range(end):",
      "        other = pos + 1",
      "        left = row[pos]",
      "        right = row[other]",
      "        if left > right:",
      "            row[pos] = right",
      "            row[other] = left",
      "    print(\"Pass:\", row)",
    ].join("\n"),
    lastOutput: "Pass: [1, 2, 4, 5, 8]",
  },
  {
    filename: "password_check.py",
    title: "Check a sample password",
    caption: "Strings + simple rules · learning demo",
    starterKey: "csg-site-password-check",
    code: [
      "# Learning demo, not security",
      "password = \"GuamSunrise42!\"",
      "rules = [",
      "    len(password) >= 12,",
      "    any(",
      "        char.isupper()",
      "        for char in password",
      "    ),",
      "    any(",
      "        char.isdigit()",
      "        for char in password",
      "    ),",
      "    any(",
      "        char in \"!@#$\"",
      "        for char in password",
      "    ),",
      "]",
      "score = sum(rules)",
      "rating = \"Keep improving\"",
      "if score == 4:",
      "    rating = \"Strong\"",
      "print(f\"Score: {score}/4\")",
      "print(rating)",
    ].join("\n"),
    lastOutput: "Strong",
  },
  {
    filename: "chamorro_hello.py",
    title: "Chamorro greetings",
    caption: "Strings, loops + letter counts",
    starterKey: "csg-site-chamorro-hello",
    code: [
      "phrases = [",
      "    (\"Håfa adai\", \"hello\"),",
      "    (\"Si Yu'os ma'åse'\",",
      "     \"thank you\"),",
      "]",
      "for phrase in phrases:",
      "    text, meaning = phrase",
      "    print(text, \"—\", meaning)",
      "    count = sum(",
      "        char.isalpha()",
      "        for char in text",
      "    )",
      "    print(\"Letters:\", count)",
    ].join("\n"),
    lastOutput: "Letters: 11",
  },
]
