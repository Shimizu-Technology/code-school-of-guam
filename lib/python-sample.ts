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
      'print("Guam: sample data")',
      'for f in [77, 86, 95]:',
      '    c = (f - 32) * 5 / 9',
      '    print(f"{f}°F = {c:.0f}°C")',
      '',
      'print("Rain: █ = 50 mm")',
      'rain = {"Jan": 100, "Jun": 150,',
      '        "Sep": 350}',
      'for month, mm in rain.items():',
      '    bars = "█" * (mm // 50)',
      '    print(month, bars, mm, "mm")',
    ].join("\n"),
    lastOutput: "Sep ███████ 350 mm",
  },
  {
    filename: "tip_split.py",
    title: "Split a restaurant bill",
    caption: "Arithmetic + formatted numbers",
    starterKey: "csg-site-tip-split",
    code: [
      'bill = 84',
      'tip_percent = 18',
      'people = 3',
      '',
      'tip = bill * tip_percent / 100',
      'total = bill + tip',
      'each = total / people',
      'print(f"Bill: ${bill:.2f}")',
      'print(f"Tip: ${tip:.2f}")',
      'print(f"Each pays: ${each:.2f}")',
    ].join("\n"),
    lastOutput: "Each pays: $33.04",
  },
  {
    filename: "fizzbuzz.py",
    title: "FizzBuzz",
    caption: "Loops, remainders + conditions",
    starterKey: "csg-site-fizzbuzz",
    code: [
      'for n in range(1, 16):',
      '    if n % 15 == 0:',
      '        print("FizzBuzz")',
      '    elif n % 3 == 0:',
      '        print("Fizz")',
      '    elif n % 5 == 0:',
      '        print("Buzz")',
      '    else:',
      '        print(n)',
    ].join("\n"),
    lastOutput: "FizzBuzz",
  },
  {
    filename: "bubble_sort.py",
    title: "Bubble sort",
    caption: "Nested loops + swapping values",
    starterKey: "csg-site-bubble-sort",
    code: [
      'numbers = [5, 1, 4, 2, 8]',
      'print("Start:", numbers)',
      'for end in range(4, 0, -1):',
      '    for i in range(end):',
      '        a, b = numbers[i:i + 2]',
      '        if a > b:',
      '            numbers[i] = b',
      '            numbers[i + 1] = a',
      '    print("Pass:", numbers)',
    ].join("\n"),
    lastOutput: "Pass: [1, 2, 4, 5, 8]",
  },
  {
    filename: "password_check.py",
    title: "Check a sample password",
    caption: "Strings + simple rules · learning demo",
    starterKey: "csg-site-password-check",
    code: [
      '# Learning demo, not security',
      'p = "GuamSunrise42!"',
      'rules = [',
      '    len(p) >= 12,',
      '    any(c.isupper() for c in p),',
      '    any(c.isdigit() for c in p),',
      '    any(c in "!@#$" for c in p),',
      ']',
      'score = sum(rules)',
      'rating = "Keep improving"',
      'if score == 4:',
      '    rating = "Strong"',
      'print(f"Score: {score}/4")',
      'print(rating)',
    ].join("\n"),
    lastOutput: "Strong",
  },
  {
    filename: "chamorro_hello.py",
    title: "Chamorro greetings",
    caption: "Strings, loops + letter counts",
    starterKey: "csg-site-chamorro-hello",
    code: [
      'phrases = [',
      '    ("Håfa adai", "hello"),',
      '    ("Si Yu\'os ma\'åse\'",',
      '     "thank you"),',
      ']',
      'for text, meaning in phrases:',
      '    print(text, "—", meaning)',
      '    n = sum(c.isalpha()',
      '            for c in text)',
      '    print(f"Letters: {n}")',
    ].join("\n"),
    lastOutput: "Letters: 11",
  },
]
