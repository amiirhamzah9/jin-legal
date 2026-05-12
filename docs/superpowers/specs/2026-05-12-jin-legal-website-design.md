# Jin Legal Website — Design Specification
**Date:** 2026-05-12  
**Status:** Approved  
**Company:** PT Juris International Network (brand: JIN Legal)

---

## 1. Project Overview

A full-featured marketing website for Jin Legal, a legal consulting firm based in Jakarta, Indonesia. The site serves as the firm's primary digital presence — attracting corporate clients, showcasing expertise, and enabling direct consultation requests.

**Primary goals:**
- Establish credibility and prestige for the firm
- Showcase 11 practice areas and 6 partners
- Generate consultation leads via contact form
- Support ongoing thought leadership via Insights blog
- Enable non-technical staff to update content (blog, team bios, careers)

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js 14 (App Router), TypeScript | SEO, performance, modern DX |
| Styling | Tailwind CSS | Utility-first, consistent tokens |
| Database | Supabase (PostgreSQL) | Content management + contact form storage |
| Auth | Supabase Auth | Admin dashboard login |
| Storage | Supabase Storage | Partner photos, blog cover images |
| Deployment | Vercel | Seamless Next.js deployment |
| Fonts | Cormorant Garamond + Jost | Elegant serif headlines, clean body |

---

## 3. Design System

### Color Tokens
```
--forest:       #1a4035   Primary background, dark sections
--forest-deep:  #0e2820   Hero, footer, navbar
--forest-mid:   #245548   Hover states, mid sections
--gold:         #c9a84c   Accent, CTA, highlights
--gold-light:   #e2c97e   Hover gold, gradient end
--gold-pale:    #f5edda   Subtle card hover shimmer
--ivory:        #faf7f1   Main page background
--ivory-dark:   #f0ebe0   Section alternates, stats bar
--ink:          #1a2420   Primary text
--ink-muted:    #6b7f78   Secondary text
--ink-faint:    #a8b8b2   Timestamps, metadata
```

### Typography
- **Display / Headlines:** Cormorant Garamond (300, 400, 500, 600, 700 + italic)
- **Body / UI:** Jost (300, 400, 500, 600, 700)
- **Hero H1:** `clamp(48px, 6.5vw, 82px)`, weight 300, line-height 1.18
- **Section H2:** 38–42px, weight 400
- **Labels / eyebrows:** Jost 9–10px, letter-spacing 4px, uppercase

### Logo
- File: `assets/logo/jin-logo-crop.png` (transparent background, black)
- Navbar: height 28px, `filter: brightness(0) invert(1)` (white on dark)
- Footer: height 24px, same filter
- Light backgrounds: use `jin-logo-crop.png` directly (black)

### Motion Principles
- Hover transitions: `0.25–0.3s` ease
- Team card image: `grayscale(30%)` → `grayscale(0%)` on hover + scale(1.04)
- Gold underline on nav links: `scaleX(0) → scaleX(1)` from left
- Practice area cards: `translateY(-3px)` + box-shadow + gold shimmer
- CTA button: fill animation left-to-right on hover
- Grain overlay: fixed, `opacity: 0.025`, adds depth

---

## 4. Site Architecture

### Pages & Routes
```
/                        Homepage
/about                   About the Firm
/practice-areas          Practice Areas listing (icon grid)
/practice-areas/[slug]   Individual practice area (×11)
/team                    Partners — dark cinematic layout
/insights                Blog listing
/insights/[slug]         Blog post detail
/careers                 Open positions
/contact                 Contact + lead form
/admin                   Protected admin dashboard
```

### Supabase Schema
```sql
-- Blog content
blog_posts (
  id, title, slug, content, excerpt,
  cover_image_url, category, published_at,
  is_published, created_at
)

-- Team members
team_members (
  id, name, credentials, role, bio,
  photo_url, practice_areas, display_order,
  is_active
)

-- Practice areas
practice_areas (
  id, title, slug, description, full_content,
  icon_name, display_order
)

-- Career listings
careers (
  id, title, description, type, location,
  is_active, created_at
)

-- Contact form leads
contact_leads (
  id, name, email, phone, company,
  subject, message, created_at
)
```

---

## 5. Page Designs

### 5.1 Navigation (fixed, all pages)
- Background: `rgba(14,40,32,.96)` + `backdrop-filter: blur(20px)`
- Height: 70px, padding: 0 72px
- Logo: 28px height, white filter
- Links: Jost 11px, letter-spacing 2px, uppercase, gold underline on hover
- CTA: "Consult With Us" — gold button, right side

### 5.2 Homepage
**Sections (top → bottom):**
1. **Hero** — Full viewport, forest-deep bg, subtle grid lines, chess/legal bg image (opacity 0.08), large Cormorant headline "Legal Excellence, *Strategic Results.*" with gold gradient italic, two CTAs, stat box (11 practice areas)
2. **Stats bar** — Ivory-dark bg, 4 columns: 11+ Practice Areas · 6 Partners · 200+ Clients · 10+ Years
3. **About strip** — Forest bg, 2-col: firm description + 4 value cards (Integrity, Precision, Innovation, Results)
4. **Practice Areas** — Ivory bg, 4-col icon grid, 11 cards + CTA card, gold top border, hover shimmer
5. **Team preview** — Forest-deep bg, 3-card cinematic strip (Managing Partner + 2 Partners), "View All" CTA
6. **Insights** — White bg, featured article (2fr) + 2 smaller articles (1fr each)
7. **CTA Banner** — Gold bg, "Ready to work with us?" + "Get in Touch" white button
8. **Footer** — Forest-deep bg, 4-col: Brand + Practice Areas + Company + Contact

### 5.3 About Page
- Hero: forest-deep, firm story headline
- Content: founding story, mission, values (full width)
- Team teaser: 6-card cinematic grid (all partners)
- Credentials/licenses section: display NIB, NPWP, SERTIFIKAT STANDAR (documents from /Desktop/JIN/)
- CTA strip

### 5.4 Practice Areas (listing)
- Hero: compact, forest-deep
- 4-col icon grid: all 11 practice areas, each links to `/practice-areas/[slug]`
- Each card: icon + number + title + 1-line description

### 5.5 Practice Area (detail subpage)
- Hero: practice area name + icon, forest bg
- Content: full description from Supabase, 2-col layout
- Related partners who handle this area
- Related insights/articles
- CTA: "Discuss this with our team"

### 5.6 Team Page
- Hero: "The Partners Behind Jin Legal"
- Layout B: 3+3 dark cinematic grid (all 6 partners)
- Hover: reveal bio + gold bar animation
- Filter tabs: All · Corporate & Business · Litigation · Specialties

### 5.7 Insights (listing)
- Hero: compact
- Featured post: large hero card
- Grid: 3-col blog cards with category filter
- Pagination

### 5.8 Insights (detail)
- Article header: title, author (partner), date, category
- Content: Markdown stored in Supabase, rendered via `react-markdown` with custom typography styles
- Related articles sidebar

### 5.9 Careers
- Open positions listed from Supabase
- Each: title, type (full-time/contract), description
- Application CTA (email or form)

### 5.10 Contact
- Two columns: contact form (left) + office info / map embed (right)
- Form fields: Name, Email, Phone, Company, Subject (dropdown: practice areas), Message
- Submission: saves to `contact_leads` Supabase table
- Success state: confirmation message

### 5.11 Admin Dashboard (`/admin`)
- Protected by Supabase Auth
- CRUD for: blog posts, team members (reorder, edit bio/photo), practice area descriptions, careers, view contact leads

---

## 6. Partners

| Name | Credentials | Role |
|---|---|---|
| Muhammad Subuh Rezki | S.H. | Managing Partner |
| Ryan Tampubolon | S.H. | Partner |
| Abi Rafdi | S.H. | Partner |
| Achmad Firmansyah | S.H. | Partner |
| Amir Hamzah | S.H. | Partner |
| Aditya Muriza | S.H. | Partner |

---

## 7. Practice Areas (11)

| # | Name | Slug |
|---|---|---|
| 01 | Business & Corporate Law | business-corporate-law |
| 02 | Litigation & Dispute Resolution | litigation-dispute-resolution |
| 03 | Employment Law | employment-law |
| 04 | Advisory & Regulatory Compliance | advisory-regulatory-compliance |
| 05 | Insolvency, Restructuring & PKPU | insolvency-restructuring-pkpu |
| 06 | Technology, Media & Telecommunications | technology-media-telecommunications |
| 07 | Intellectual Property | intellectual-property |
| 08 | Consumer Protection | consumer-protection |
| 09 | Criminal Defense & White Collar Crime | criminal-defense-white-collar |
| 10 | Sport & Entertainment | sport-entertainment |
| 11 | Banking, Finance & FinTech | banking-finance-fintech |

---

## 8. Content & SEO

- Language: **English** (primary)
- Meta titles: `[Page] — Jin Legal | PT Juris International Network`
- OG image: forest green background + JIN. logo
- Sitemap: auto-generated by Next.js
- robots.txt: allow all, block /admin

---

## 9. Assets

| File | Location | Usage |
|---|---|---|
| jin-logo-crop.png | assets/logo/ | Website logo (black, transparent bg) |
| jin-logo-white.png | assets/logo/ | White version reference |
| JIN profile pict.jpg | assets/ | Company profile image |

Partner photos and blog images to be uploaded via Supabase Storage after launch.

---

## 10. Out of Scope (v1)

- Multi-language (Bahasa Indonesia)
- Client portal / document sharing
- Online payment / retainer system
- Live chat
- WhatsApp floating button (can be added post-launch easily)
