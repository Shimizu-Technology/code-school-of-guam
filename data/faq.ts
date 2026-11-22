export interface FaqItem {
  question: string
  answer: string
}

export interface FaqGroup {
  id: string
  title: string
  description: string
  items: FaqItem[]
}

export const faqGroups: FaqGroup[] = [
  {
    id: "choosing-a-path",
    title: "Choosing a path",
    description: "Focused courses, the full bootcamp, and who each is for.",
    items: [
      {
        question: "What is the difference between a focused course and the full bootcamp?",
        answer: "A focused course teaches one subject through short lessons, practice, and a bounded project with instructor review. Guided runs add private instructor meetings and live coaching; a future self-paced option would include project review and course messaging without private Zoom meetings. The full bootcamp is a longer program across frontend, backend, databases, and AI, with integrated projects and sustained instruction. Completing focused courses does not mean you have completed the bootcamp."
      },
      {
        question: "Can I enroll in Python Fundamentals now?",
        answer: "The first three-week Python Fundamentals run is being prepared for an invited group in early 2027. Public enrollment is not open. You can join the course-specific updates list on the Python Fundamentals page to hear about a later public run."
      },
      {
        question: "Do I need prior coding experience?",
        answer: "Python Fundamentals and the planned Ruby and JavaScript fundamentals courses start with the basics and welcome beginners. Later focused courses list their recommended skills on the course page; equivalent experience is welcome, and you do not have to buy an earlier CSG course. The full bootcamp has its own cohort-specific entry requirements."
      },
      {
        question: "Is there an age requirement?",
        answer: "The invited early 2027 Python pilot is for adults. We are exploring future courses for ages 13–17 with guardian involvement and appropriate support and safety practices. Any course for younger children would be developed separately. Each offer will state its age requirements before enrollment."
      },
      {
        question: "Can I take a course from outside Guam?",
        answer: "Our future focused courses are being designed for online learners beyond Guam. The early 2027 Python pilot is an invited adult group. Before any public guided run opens, we will publish its instructor availability and meeting times clearly across time zones. The full bootcamp has its own cohort-specific requirements."
      },
      {
        question: "Will there be a self-paced option?",
        answer: "We plan to use the same lessons, exercises, and project for two options. Self-paced learners would study on their own schedule with course-question messaging and instructor review of their projects, without private Zoom meetings. We plan 12 months of self-paced lesson access; the messaging window and reply times will be set in the written offer. Guided learners would also get private instructor meetings and live personal feedback. The invited early 2027 Python pilot tests the guided format. Public enrollment and self-paced pricing are not open or announced; final written terms will be published first."
      },
      {
        question: "Why is there only one full bootcamp cohort in 2026?",
        answer: "The March 2026 full bootcamp cohort began March 2 and is closed to new students. We have not announced another full cohort for 2026. We are also developing shorter focused courses, starting with an invited Python Fundamentals pilot in early 2027. Those are separate from the full bootcamp."
      },
    ],
  },
  {
    id: "learning-and-support",
    title: "Learning and support",
    description: "Schedule, equipment, teaching, resources, and opportunities after the program.",
    items: [
      {
        question: "Why does the full bootcamp teach Ruby on Rails, and what languages will focused courses use?",
        answer: "Ruby on Rails has been part of our full bootcamp because it lets learners build and understand a complete web application. Focused courses will use the language that fits their subject: the invited early 2027 pilot starts with Python, and we are developing Ruby and JavaScript fundamentals along with later courses in areas such as SQL, frontend development, and Rails APIs. Each course page will state what it teaches and what learners should know before starting."
      },
      {
        question: "Do I need to have a Mac to join the program?",
        answer: "A Mac is not required for the invited Python Fundamentals pilot; learners can write and run Python in Hafa Code through a browser. Device and setup requirements for other courses or bootcamp cohorts will be shared with each offer."
      },
      {
        question: "Are the classes held in-person or online?",
        answer: "The March 2026 full bootcamp began with live Zoom sessions, structured online practice, and mentorship; enrolled students now follow individual completion or restart schedules. The invited Python Fundamentals pilot uses short lessons and one private Zoom hour each week. Later guided runs may use trained instructors, while a future self-paced option would include project review and messaging without private Zoom meetings. Check each offer before enrolling."
      },
      {
        question: "How does the internship work?",
        answer: "Some graduates have practiced on real software through Shimizu Technology. Internships, contracts, teaching roles, and jobs depend on available projects and each graduate's readiness; none is guaranteed by completing a course or the bootcamp. Any defined internship for a future cohort will be described in that cohort's written offer."
      },
      {
        question: "How long do I have access to the class recordings?",
        answer: "Recording and resource access depends on the specific course or cohort. We will provide the access period in its written terms before payment."
      },
      {
        question: "Can I reach out for support after the program ends?",
        answer: "You can contact us after a course ends. The period and type of instructor support included with enrollment will be described in that offer's written terms."
      },
      {
        question: "Are there opportunities to become a teaching assistant?",
        answer: "Outstanding graduates may be considered for paid teaching roles when openings exist. Completing a course or the bootcamp does not guarantee a position."
      },
      {
        question: "What is the hybrid format?",
        answer: "The original March 2026 full bootcamp schedule used live Zoom classes on Tuesday and Thursday, structured practice during the week, and mentorship. Enrolled learners now follow individual completion or restart schedules. Guided focused courses use a different format: short lessons, exercises, project feedback, and private meetings. A future self-paced option would include project review and messaging without private Zoom meetings. See each offer page for its current schedule and support terms."
      },
      {
        question: "What AI tools will I learn?",
        answer: "The full bootcamp has taught a progression from coding fundamentals to building AI-powered applications. Specific tools and any paid software licenses depend on the cohort's curriculum and written offer. Python Fundamentals starts with beginner Python and does not require prior AI experience."
      },
      {
        question: "Do I need to know anything about AI before starting?",
        answer: "No prior AI knowledge is needed for Python Fundamentals. The full bootcamp has introduced AI after core coding skills; a future cohort's exact AI curriculum will be described with its offer."
      },
      {
        question: "What resources do you recommend to get started with coding?",
        answer: "We recommend trying Python directly in our browser tool Hafa Code (code.shimizu-technology.com), or exploring free coding platforms like freeCodeCamp to practice coding concepts in-browser before starting."
      },
    ],
  },
  {
    // /policies redirects here.
    id: "tuition-and-policies",
    title: "Tuition and policies",
    description: "Prices and written terms for a specific course or cohort.",
    items: [
      {
        question: "What did the March 2026 bootcamp cost?",
        answer: "The $7,500 figure was tuition for the March 2026 full bootcamp cohort, which is closed to new students. The price for a future full cohort has not been announced. Focused courses have separate prices and terms when enrollment opens."
      },
      {
        question: "Do you offer payment plans?",
        answer: "Payment options depend on the specific offer. The March 2026 bootcamp had installment options; terms for a future cohort have not been announced. Ask us for the current written terms before making a payment."
      },
      {
        question: "What is the attendance policy?",
        answer: "Attendance expectations depend on the course or cohort. We will provide them, including any consequences of missed sessions, in the written terms for that offer before payment."
      },
      {
        question: "Is there a refund policy?",
        answer: "Refund and deposit terms depend on the course or cohort. We will provide the applicable policy in writing before payment."
      },
      {
        question: "How can I access the policies?",
        answer: "Please email codeschoolofguam@gmail.com for the written terms that apply to your specific cohort or course. We will show the applicable access, meeting, and refund terms before accepting payment for a new offer."
      }
    ],
  },
]
