# PostHog Analytics Tracking Guide
## Code School of Guam - February 2026 Cohort

This document explains all the analytics tracking events implemented on the website and how to use them to optimize your enrollment funnel.

---

## 📊 Events Being Tracked

### 1. **Apply Button Clicks** (`apply_button_clicked`)
Tracks every time someone clicks an "Apply for February Cohort" button.

**Event Properties:**
- `location`: Where the button was clicked
  - `hero_section` - Main Apply button at top
  - `testimonials_section` - After student testimonials
  - `value_section` - In "What's Included" section
  - `pricing_card` - On the pricing card
  - `student_projects_section` - After capstone videos
  - `final_cta_section` - Bottom of page
- `cohort`: "February 2026"
- `button_text`: "Apply for February Cohort"

**Why it matters:** Shows which sections are most effective at driving applications.

---

### 2. **View Pricing Clicks** (`view_pricing_clicked`)
Tracks when someone clicks "View Pricing & Payment Plans" buttons.

**Event Properties:**
- `location`: Where the button was clicked
  - `hero_section` - Main pricing link
  - `value_section` - After testimonials
- `scroll_to`: "programs_section"

**Why it matters:** Shows how many people are price-conscious vs. value-focused.

---

### 3. **Scroll Depth** (`scroll_depth_reached`)
Tracks how far down the page visitors scroll.

**Milestones Tracked:**
- 25% of page
- 50% of page
- 75% of page
- 100% of page (reached bottom)

**Event Properties:**
- `depth`: "25%", "50%", "75%", or "100%"
- `page`: "landing_page"

**Why it matters:** Shows if visitors are engaged enough to read through your content.

---

### 4. **Section Views** (`section_viewed`)
Tracks when visitors scroll into view of each major section.

**Sections Tracked:**
- `why-choose-us`
- `what-youll-learn`
- `programs` (pricing)
- `student-projects`
- `timeline`
- `internship`
- `career`
- `admissions`
- `faq`
- `contact`

**Event Properties:**
- `section`: The section ID

**Why it matters:** Shows which content visitors are actually viewing vs. bouncing before.

---

### 5. **Page Views** (`$pageview`)
Automatically tracked by PostHog for every page load.

**Event Properties:**
- `$current_url`: Full page URL

**Why it matters:** Shows total traffic and which pages get visited.

---

## 📈 How to View Your Analytics

### **In PostHog Dashboard:**

1. **Go to Insights** → Create New Insight
2. **Common Queries to Set Up:**

#### **Apply Button Performance**
```
Event: apply_button_clicked
Breakdown by: location
Chart Type: Bar
Time Range: Last 30 days
```
**What you'll see:** Which sections drive the most applications.

#### **Funnel Analysis**
```
Step 1: $pageview (landing page)
Step 2: scroll_depth_reached (depth = 50%)
Step 3: view_pricing_clicked
Step 4: apply_button_clicked
```
**What you'll see:** Your conversion funnel and drop-off points.

#### **Scroll Engagement**
```
Event: scroll_depth_reached
Breakdown by: depth
Chart Type: Funnel
```
**What you'll see:** How many visitors reach each depth milestone.

#### **Section Engagement**
```
Event: section_viewed
Breakdown by: section
Chart Type: Bar
Time Range: Last 7 days
```
**What you'll see:** Which sections get the most views.

---

## 🎯 Key Metrics Dashboard Setup

Create a **PostHog Dashboard** with these tiles:

### Tile 1: **Overall Conversion Rate**
```
Total apply_button_clicked / Total $pageview * 100
```

### Tile 2: **Apply Button Heatmap**
```
Event: apply_button_clicked
Grouped by: location
Visualization: Bar chart
```

### Tile 3: **Scroll Engagement**
```
Event: scroll_depth_reached
Grouped by: depth
Visualization: Funnel
```

### Tile 4: **Traffic Over Time**
```
Event: $pageview
Time series: Daily
```

### Tile 5: **Most Viewed Sections**
```
Event: section_viewed
Top 10 by: section
```

---

## 📊 Weekly Metrics to Track (Manual Spreadsheet)

| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| **Website Traffic** | | | |
| - Total visitors | | | |
| - Apply button clicks | | | |
| - Pricing clicks | | | |
| **Application Funnel** | | | |
| - Google Forms opened | | | |
| - Google Forms submitted | | | |
| - Email sent | | | |
| - Calendly clicks | | | |
| - Calls scheduled | | | |
| - Calls completed | | | |
| - Deposits paid | | | |
| **Conversion Rates** | | | |
| - Website → Apply Click | | | |
| - Form Open → Submit | | | |
| - Email → Call Booked | | | |
| - Call → Deposit | | | |
| - Overall (Website → Enrolled) | | | |

---

## 🔍 Google Form Analytics

Access Google Forms analytics:
1. Open your form: [https://forms.gle/8vNXoqxCimxjfXkU6](https://forms.gle/8vNXoqxCimxjfXkU6)
2. Click "Responses" tab
3. Click the three dots → "Get summary"
4. View completion rate and drop-off points

**Key Metrics:**
- **Form Starts vs. Submissions**: Shows if form is too long
- **Drop-off by Section**: Which section loses people
- **Average Completion Time**: If >5 minutes, might be too long

---

## 📧 Email Tracking Setup

### **Calendly Link Tracking**
Add UTM parameters to your Calendly link in the email:

```
https://calendly.com/leonshimizu/discovery-call?utm_source=email&utm_medium=application&utm_campaign=feb2026
```

**In Calendly Dashboard:**
- View booking rate by source
- Track no-show rate
- See popular booking times

### **Email Service Provider**
If using Gmail, you won't get click tracking. Consider:
- **Mailchimp** (free up to 500 contacts)
- **SendGrid** (free tier available)
- **ConvertKit** (for automation)

These show:
- Open rate
- Click-through rate
- Link clicks

---

## 🎯 Optimization Targets

Based on industry benchmarks for coding bootcamps:

| Metric | Target | Good | Needs Work |
|--------|--------|------|------------|
| Scroll to 50% | >60% | 50-60% | <50% |
| Apply Button CTR | >5% | 3-5% | <3% |
| Form Completion | >75% | 60-75% | <60% |
| Call Booking Rate | >60% | 50-60% | <50% |
| Call Show-Up Rate | >80% | 70-80% | <70% |
| Call → Deposit | >70% | 60-70% | <60% |
| Overall (Web → Enrolled) | >2% | 1-2% | <1% |

---

## 🚀 Quick Wins Based on Data

### If "Apply Button CTR" is low (<3%):
- Price might be scaring people off (already removed ✅)
- Value proposition isn't clear
- Add more social proof earlier

### If "Scroll Depth" is low (<50% reaching 50%):
- Hero section not engaging enough
- Page loads too slow
- Content above fold isn't compelling

### If "Form Completion" is low (<75%):
- Form is too long
- Questions are too invasive
- No progress indicator

### If "Call Booking Rate" is low (<60%):
- Email isn't compelling
- Calendly link is broken
- Too much time between email and booking

### If "Call Show-Up" is low (<80%):
- Too much time between booking and call (schedule faster)
- No reminder emails (set up Calendly reminders)
- They found another program

### If "Call → Deposit" is low (<70%):
- Price objections (promote payment plans)
- Schedule conflicts
- Not a good fit (this is actually good - quality filter)

---

## 📱 Mobile vs Desktop Tracking

PostHog automatically tracks device type. Create filters:

**Mobile Performance:**
```
Event: apply_button_clicked
Filter: Device Type = Mobile
```

**Desktop Performance:**
```
Event: apply_button_clicked
Filter: Device Type = Desktop
```

Compare conversion rates - mobile often converts lower but reaches more people.

---

## 🔔 Set Up Alerts

In PostHog, set up alerts for:

1. **Daily Application Count Drops**
   - Alert if <2 apply button clicks per day
   - Might indicate site is down or traffic issue

2. **Unusual Traffic Spike**
   - Alert if >100 visitors in a day
   - Might indicate viral post or ad success

3. **Zero Conversions**
   - Alert if 0 apply clicks in 48 hours
   - Check if form link is broken

---

## 📞 Next Steps

1. ✅ **PostHog tracking is now live** on your site
2. ⏳ **Set up Calendly** with your availability
3. ⏳ **Update Google Form** with new schedule info (16 hrs Mon-Thu)
4. ⏳ **Create email template** with Calendly link
5. ⏳ **Build PostHog dashboard** with the tiles above
6. ⏳ **Track weekly metrics** in a spreadsheet

---

## 🎓 Resources

- **PostHog Dashboard**: https://app.posthog.com
- **Google Forms Analytics**: https://docs.google.com/forms
- **Calendly Setup**: https://calendly.com
- **UTM Builder**: https://ga-dev-tools.google/campaign-url-builder/

---

**Questions?** The tracking is now running automatically. Check PostHog tomorrow to see your first data coming in!

Last Updated: November 25, 2025



