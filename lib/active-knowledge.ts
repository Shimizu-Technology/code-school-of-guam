// Only reviewed, current sources are eligible for new chatbot embeddings.
// A version filter also prevents old vectors from appearing after source edits.
export const ACTIVE_KNOWLEDGE_VERSION = '2026-09-courses';

export const ACTIVE_KNOWLEDGE_FILES = [
  'about.md',
  'current-offers-2026-09.md',
] as const;

// Keep the public chatbot useful while a new version of the index is populated.
// This contains only reviewed current facts; older policy files are not a fallback.
export const ACTIVE_KNOWLEDGE_FALLBACK = `Code School of Guam was founded by Leon Shimizu in 2024. It offers a full software development bootcamp and is preparing shorter focused courses.
The March 2026 full bootcamp cohort began March 2 and is closed to new students. Its tuition was $7,500. Dates, tuition, schedule, and internship terms for a future full cohort have not been announced.
Python Fundamentals is a separate three-week beginner course being prepared for a small invited adult group in the first three weeks of December 2026. Public enrollment is not open. Learners will use short lessons and Hafa Code, submit work in CSG Learn, build an expense-summary project, and have one private Zoom hour with Leon each week. Exact dates and written student terms will be shared before payment. The public page at https://codeschoolofguam.com/courses/python-fundamentals has an updates list for a later run; it does not reserve a pilot seat.
Python Automation, SQL and Data Basics, Ruby Fundamentals, JavaScript Fundamentals, Rails APIs, frontend, and AI courses are planned directions, not scheduled or purchasable offers. Completing focused courses does not equal graduating from the full bootcamp.
Alanna Cruz is a CSG graduate who now works at DMR. Audreana Crane is a CSG graduate who teaches introductory coding at Father Dueñas Memorial School.
Some graduates have practiced on real software through Shimizu Technology. Internships, contracts, teaching roles, and jobs depend on available projects and each graduate's readiness; none is guaranteed by completing a course or bootcamp.
Access, meetings, rescheduling, and refund terms are specific to each offer and will be provided in writing before payment. Contact codeschoolofguam@gmail.com or +1 (671) 483-0219 for unannounced terms.`;
