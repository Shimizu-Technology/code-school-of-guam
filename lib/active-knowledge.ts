// Only reviewed, current sources are eligible for new chatbot embeddings.
// Bump this immutable version whenever a source changes. The embedding script
// refuses to overwrite a published version.
export const ACTIVE_KNOWLEDGE_VERSION = '2026-09-courses-20260928-v4';
// SHA-256 of each listed filename, NUL, file bytes, NUL in list order.
// Recompute and change this with every reviewed source update. The upload script
// refuses a mismatched bundle; different revisions cannot publish one manifest.
export const ACTIVE_KNOWLEDGE_SOURCE_SHA256 = '4cb9064ce9ff74f283d4c2e72a7baf73db560477de0bff534146fe94693b00c9';
export const ACTIVE_KNOWLEDGE_MANIFEST_ID = `${ACTIVE_KNOWLEDGE_VERSION}::${ACTIVE_KNOWLEDGE_SOURCE_SHA256}::manifest`;

export const ACTIVE_KNOWLEDGE_FILES = [
  'about.md',
  'current-offers-2026-09.md',
] as const;

// Keep the public chatbot useful while a new version of the index is populated.
// This contains only reviewed current facts; older policy files are not a fallback.
export const ACTIVE_KNOWLEDGE_FALLBACK = `Code School of Guam was founded by Leon Shimizu in 2024. It offers a full software development bootcamp and is preparing shorter focused courses.
The March 2026 full bootcamp cohort began March 2 and is closed to new students. Its original synchronized end date no longer describes every learner; enrolled students continue on individual completion or restart schedules. Its tuition was $7,500. Dates, tuition, schedule, and internship terms for a future full cohort have not been announced.
Python Fundamentals is a separate three-week beginner course being prepared for a small invited adult group in the first three weeks of December 2026. Public enrollment is not open. Learners will use short lessons and Hafa Code, submit work in CSG Learn, independently build and explain an expense-summary project, and have one private Zoom hour with Leon each week. An optional later lesson shows an agent-assisted extension and how to verify its work; an AI subscription is not required to pass the fundamentals project. Exact dates and written student terms will be shared before payment. The public page at https://codeschoolofguam.com/courses/python-fundamentals has an updates list for a later run; it does not reserve a pilot seat.
Python Automation, SQL and Data Basics, Ruby Fundamentals, JavaScript Fundamentals, Rails APIs, frontend, and AI courses are planned directions, not scheduled or purchasable offers. Completing focused courses does not equal graduating from the full bootcamp.
CSG plans self-paced study alongside limited guided runs using the same core lessons, exercises, and project. Self-paced learners would have course-question messaging but no private Zoom meetings or individual project review. CSG plans 12 months of self-paced lesson access. The messaging window, reply times, and price will be in the written offer before public enrollment. Guided runs add private instructor meetings and personal feedback. Guided places depend on each instructor's available hours; trained alumni may teach later runs after the pilot is evaluated. Future online courses are being designed for learners beyond Guam. The December pilot is adult-only. CSG is exploring later courses for ages 13–17 with guardian involvement and safeguards, and would develop any younger-child offer separately.
Alanna Cruz is a CSG graduate who now works at DMR. Audreana Crane is a CSG graduate who teaches introductory coding at Father Dueñas Memorial School.
Some graduates have practiced on real software through Shimizu Technology. Internships, contracts, teaching roles, and jobs depend on available projects and each graduate's readiness; none is guaranteed by completing a course or bootcamp.
Access, meetings, rescheduling, and refund terms are specific to each offer and will be provided in writing before payment. Contact codeschoolofguam@gmail.com or +1 (671) 483-0219 for unannounced terms.`;
