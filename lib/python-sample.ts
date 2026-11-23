// Shared non-client sample so Server Components (like /courses/python-fundamentals
// and the pre-highlighted hero code) and Client Components (HeroEditor) read the
// exact same Python source string.
export const DEFAULT_PYTHON_CODE = [
  "costs = {",
  "    \"Food\": 61,",
  "    \"Transport\": 48,",
  "    \"Supplies\": 9,",
  "}",
  "budget = 120",
  "",
  "total = sum(costs.values())",
  "print(f\"Total: ${total}\")",
  "",
  "for item in costs:",
  "    cost = costs[item]",
  "    print(f\"{item}: ${cost}\")",
  "",
  "left = budget - total",
  "if left >= 0:",
  "    print(f\"Left: ${left}\")",
].join("\n")

export const EDITOR_LINES: readonly string[] = DEFAULT_PYTHON_CODE.split("\n")

export const EDITOR_OUTPUT = [
  "Total: $118",
  "Food: $61",
  "Transport: $48",
  "Supplies: $9",
  "Left: $2",
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
    lastOutput: "Left: $2",
  },
  {
    filename: "guam_weather.py",
    title: "Guam weather",
    caption: "Conversions + text charts · sample data",
    starterKey: "csg-site-guam-weather",
    code: [
      "print(\"Guam: sample data\")",
      "for f in [77, 86, 95]:",
      "    c = (f - 32) * 5 // 9",
      "    print(f\"{f}°F = {c}°C\")",
      "",
      "print(\"Rain (mm): █ = 50\")",
      "rain = {\"Jan\": 100,",
      "        \"Jun\": 150,",
      "        \"Sep\": 350}",
      "for month in rain:",
      "    mm = rain[month]",
      "    bar = \"█\" * (mm // 50)",
      "    print(month, bar, mm)",
    ].join("\n"),
    lastOutput: "Sep ███████ 350",
  },
  {
    filename: "tip_split.py",
    title: "Split a restaurant bill",
    caption: "Arithmetic + formatted numbers",
    starterKey: "csg-site-tip-split",
    code: [
      "bill = 84",
      "percent = 18",
      "people = 3",
      "",
      "tip = bill * percent / 100",
      "total = bill + tip",
      "each = total / people",
      "print(f\"Bill: ${bill:.2f}\")",
      "print(f\"Tip: ${tip:.2f}\")",
      "print(f\"Each: ${each:.2f}\")",
    ].join("\n"),
    lastOutput: "Each: $33.04",
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
      "pairs = len(row) - 1",
      "for turn in range(pairs):",
      "    for pos in range(pairs):",
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
      "has_upper = False",
      "has_digit = False",
      "has_symbol = False",
      "for char in password:",
      "    if char.isupper():",
      "        has_upper = True",
      "    if char.isdigit():",
      "        has_digit = True",
      "    if char in \"!@#$\":",
      "        has_symbol = True",
      "rules = [",
      "    len(password) >= 12,",
      "    has_upper,",
      "    has_digit,",
      "    has_symbol,",
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
