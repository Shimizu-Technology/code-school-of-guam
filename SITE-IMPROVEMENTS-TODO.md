# Code School of Guam - Site Improvements & Future TODO

> Last Updated: December 3, 2024

This document tracks planned improvements, feature ideas, and enhancements for the Code School of Guam website.

---

## 📊 Priority Summary

| # | Item | Priority | Target | Status |
|---|------|----------|--------|--------|
| 1 | Student AI Chatbot Showcase | 🔴 High | This week | 🟡 Pending |
| 2 | Instructor/Real Projects Showcase | 🔴 High | Next week | 🟡 Pending |
| 3 | Countdown Timer | 🔴 High | This week | 🔴 Not Started |
| 4 | Calendly Integration & Auto-Emails | 🟡 Medium | Next 2 weeks | 🔴 Not Started |
| 5 | UTM Tracking for Social Media | 🟡 Medium | Before next ad | 🔴 Not Started |
| 6 | Automated Email Sequence | 🟡 Medium | Next 2-3 weeks | 🔴 Not Started |
| 7 | AI Chatbot for Site | 🟢 Lower | Phase 2 | 🔴 Not Started |
| 8 | More Games | 🟢 Lower | Whenever | 🔴 Not Started |
| 9 | Time on Page Dashboard | 🟢 Lower | Whenever | 🔴 Not Started |
| 10 | FAQ Interaction Tracking | 🟢 Lower | Whenever | 🔴 Not Started |
| 11 | Testimonial Videos | 🟢 Lower | Whenever | 🔴 Not Started |
| 12 | A/B Testing | 🟢 Lower | Future | 🔴 Not Started |
| 13 | Multi-Page App Refactor | 🔵 Phase 2 | When ready | 🔴 Not Started |
| 14 | Full-Stack with Database | 🔵 Phase 2 | Mar/Apr 2025 | 🔴 Not Started |

---

## 🔴 High Priority (Do First)

### 1. Student AI Chatbot Showcase
**Status:** 🟡 Pending (after student presentations)
**Target:** This week

- [ ] Record short clips (30-60 seconds) of each student demoing their AI chatbot
- [ ] Take screenshots of chatbots in action
- [ ] Create dedicated "Student Projects" section on the site
- [ ] Add student names/testimonials with their projects (with permission)

**Why:** Real students building real AI chatbots is incredibly convincing for prospective students.

---

### 2. Instructor/Real Projects Showcase
**Status:** 🟡 Pending
**Target:** Next week

Projects to feature:

#### HafaGPT - AI Chamorro Learning Tool
- [ ] Screenshots of the chatbot interface
- [ ] Screenshots of flashcards, quizzes, stories features
- [ ] Brief description: "AI-powered tool to learn Chamorro language and culture, built with Python, RAG, and LLMs"
- [ ] Link to live demo (if public)

#### Recipe Extractor
- [ ] Screenshots of TikTok/YouTube/Instagram recipe extraction
- [ ] Screenshots of the AI chatbot feature
- [ ] Brief description of tech stack used
- [ ] Link to live demo (if public)

#### Business Projects
- [ ] Hafaloha - Description and screenshots (with permission)
- [ ] Guam International Airport - Description and screenshots (with permission)
- [ ] Any other business projects worth showcasing

**Why:** Shows real-world applications and builds credibility.

---

### 3. Countdown Timer
**Status:** 🔴 Not Started
**Target:** This week

- [ ] Add countdown timer to hero section
- [ ] Display: "Pre-work starts February 2nd, 2026"
- [ ] Show days, hours, minutes remaining
- [ ] Style to match site aesthetic

**Why:** Creates urgency and reminds visitors of the upcoming cohort.

---

## 🟡 Medium Priority

### 4. Calendly Integration & Automated Emails
**Status:** 🔴 Not Started
**Target:** Next 2 weeks

Current Process:
1. User fills out Google Form
2. Leon manually writes email with Calendly link
3. User schedules call

Improved Process:
- [ ] Set up auto-response email in Google Forms (or use a tool like Zapier)
- [ ] Include Calendly link directly in the auto-email
- [ ] Create email template that's warm and welcoming
- [ ] Consider follow-up email sequence (2-3 emails before the call)

**Tools to consider:**
- Google Forms email notifications
- Zapier (Google Forms → Email)
- Mailchimp / ConvertKit for sequences
- Calendly's built-in confirmation emails

**Why:** Saves time and ensures no applicants fall through the cracks.

---

### 5. UTM Tracking for Social Media
**Status:** 🔴 Not Started
**Target:** Before next ad campaign

- [ ] Create UTM parameters for each campaign source:
  - `?utm_source=instagram&utm_medium=paid&utm_campaign=feb2026`
  - `?utm_source=facebook&utm_medium=paid&utm_campaign=feb2026`
  - `?utm_source=instagram&utm_medium=organic&utm_campaign=feb2026`
- [ ] Update PostHog dashboard to track by UTM source
- [ ] Create insight: "Applications by Traffic Source"
- [ ] Document UTM conventions for consistency

**Why:** Know which ads and posts are actually driving applications.

---

### 6. Automated Email Sequence (Post-Application)
**Status:** 🔴 Not Started
**Target:** Next 2-3 weeks

Suggested sequence:
1. **Immediate:** Thank you + Calendly link
2. **Day 2:** "What to expect on our call" + student success story
3. **Day 4:** "Questions? Reply to this email" + FAQ highlights
4. **If no call scheduled by Day 7:** Gentle reminder

- [ ] Write email copy for each message
- [ ] Set up automation (Mailchimp, ConvertKit, or similar)
- [ ] Test the sequence
- [ ] Track open rates and click rates

**Why:** Keeps applicants engaged and increases show-up rate for calls.

---

## 🟢 Lower Priority (Nice to Have)

### 7. AI Chatbot for the Site
**Status:** 🔴 Not Started
**Target:** After February cohort starts (Phase 2)

- [ ] Train chatbot on Code School of Guam & Shimizu Technology content
- [ ] Include curriculum info, FAQs, pricing, schedule
- [ ] Add to site (floating chat widget or dedicated section)
- [ ] Test thoroughly before going live
- [ ] Consider: Could be a student project for Cohort 3!

**Features:**
- Answer prospective student questions 24/7
- Pre-qualify leads before they apply
- Showcase your AI teaching capabilities (meta!)

**Why:** Great differentiator - a coding bootcamp with an AI chatbot trained on their own curriculum.

---

### 8. More Games (Flappy Bird Section)
**Status:** 🔴 Not Started
**Target:** Whenever / Could be student projects

Game ideas:
- [ ] Snake game
- [ ] Pong
- [ ] Tetris clone
- [ ] Typing speed test
- [ ] Simple puzzle game

**Why:** Fun, engaging, memorable. Could go viral on social media.

---

### 9. Time on Page Dashboard
**Status:** 🔴 Not Started

- [ ] Add "Average Time on Page" insight to PostHog dashboard
- [ ] PostHog already tracks this automatically

**Why:** Understand how engaged visitors are with your content.

---

### 8. FAQ Interaction Tracking
**Status:** 🔴 Not Started

- [ ] Add tracking for which FAQ questions are clicked
- [ ] Create PostHog insight showing most-clicked FAQs
- [ ] Use data to improve FAQ content or address concerns earlier on the page

**Why:** Understand what questions/concerns visitors have.

---

### 9. Testimonial Videos
**Status:** 🔴 Not Started

- [ ] Record video testimonials from graduates
- [ ] Keep them short (60-90 seconds)
- [ ] Add to testimonials section or create dedicated video section

**Why:** Video testimonials are more convincing than text.

---

### 12. A/B Testing
**Status:** 🔴 Not Started (Future)

Ideas to test:
- [ ] Different hero headlines
- [ ] Different CTA button text
- [ ] With/without countdown timer
- [ ] Different pricing display strategies

**Why:** Optimize conversion rate based on data.

---

## 🔵 Phase 2 - Major Refactors

### 13. Multi-Page Application (MPA) Refactor
**Status:** 🔴 Not Started
**Target:** When adding significant new content

Convert from single-page to multi-page:
- [ ] `/` - Home (hero, key value props, CTA)
- [ ] `/curriculum` - Detailed curriculum breakdown
- [ ] `/projects` - Student & instructor projects showcase
- [ ] `/pricing` - Pricing and payment plans
- [ ] `/faq` - Frequently asked questions
- [ ] `/apply` - Application form (or link to form)
- [ ] `/about` - About the school, instructors
- [ ] `/games` - Flappy bird and other games

**Pros:**
- Better SEO (each page can rank for different keywords)
- Cleaner navigation
- Easier to link to specific sections in ads
- More professional feel

**Why:** Makes sense when adding lots of new content (projects, games, etc.)

---

### 14. Full-Stack Next.js with Database
**Status:** 🔴 Not Started
**Target:** Phase 2 (March/April 2025)

**What this involves:**
- [ ] Custom application form (replace Google Form)
- [ ] PostgreSQL database (Vercel Postgres or Supabase)
- [ ] Admin dashboard to manage applications
  - View all applications
  - Update status (new, contacted, scheduled, enrolled, rejected)
  - Add notes to each applicant
  - Filter/search applications
- [ ] Email automation built-in (SendGrid, Resend, etc.)
- [ ] Deploy to Vercel

**Database Schema (rough):**
```
applications:
  - id
  - name, email, phone
  - background, goals
  - schedule_preference
  - status (new, contacted, scheduled, enrolled, rejected)
  - notes
  - created_at, updated_at

cohorts:
  - id
  - name (e.g., "February 2026")
  - start_date
  - status (upcoming, active, completed)
```

**Pros:**
- Own your data (not dependent on Google Forms)
- Build exactly what you need
- Admin dashboard to manage applications
- Better analytics and tracking
- Great portfolio piece / teaching example

**Why:** Right long-term move for scaling the business.

---

## ✅ Completed

### December 2, 2024
- [x] Updated curriculum to 20 weeks (5 pre-work + 15 live)
- [x] Added Python & AI Engineering to curriculum
- [x] Changed schedule to Mon-Thu + 3-5 hours weekend homework
- [x] Removed price from hero section
- [x] Fixed mobile hero responsiveness
- [x] Updated all dates to February 2026
- [x] Implemented PostHog analytics tracking
  - Apply button clicks (by section)
  - Scroll depth tracking
  - Pricing interest tracking
  - Section view tracking
  - Application funnel
- [x] Created PostHog dashboard with key insights
- [x] Updated Google Form (3-5 hours weekend homework)

---

## 📝 Notes & Ideas

### Content to Gather
- Student AI chatbot demos/screenshots (after presentations)
- HafaGPT screenshots and description
- Recipe Extractor screenshots and description
- Business project info (Hafaloha, Airport) - get permissions
- Graduate testimonials (video if possible)

### Questions to Answer with Data
- Which Apply button gets the most clicks?
- How far do people scroll?
- What's our visitor → application conversion rate?
- Which traffic sources drive the most applications?
- What FAQ questions do people click most?

### Future Feature Ideas
- Blog with coding tips and student stories
- Free mini-course or workshop to capture leads
- Referral program for graduates
- Alumni network/community page
- Job board for graduates

---

## 🔗 Resources

- **PostHog Dashboard:** https://us.posthog.com/project/142556/dashboard
- **Google Form:** https://forms.gle/8vNXoqxCimxjfXkU6
- **Calendly:** [Add your Calendly link here]
- **Live Site:** https://codeschoolofguam.com
- **Analytics Guide:** See `ANALYTICS-TRACKING-GUIDE.md`

---

*This document should be updated as items are completed or new ideas are added.*

