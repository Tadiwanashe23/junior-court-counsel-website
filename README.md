# Junior Court Counsel — Website

A static website built from the JCC constitution, organisation profile,
and real event photos/reports. Layout follows a charity/NGO template (top
utility bar, full-bleed photo hero, colorful feature strip) so you can
drop in your own background photos easily. No build tools required — open
the files directly in Visual Studio Code.

## Files
- `index.html`         — Homepage (photo hero slider + feature strip)
- `about.html`          — Founding values, vision, structure, org chart
- `activities.html`     — Activities hub — a grid of topic cards, each linking to its own sub-page
- `activity-*.html`     — One sub-page per activity topic (see below)
- `team.html`           — Our Team (leadership branch tree)
- `partners.html`       — Organisations JCC has partnered with
- `get-involved.html`   — Membership eligibility & how to apply
- `contact.html`        — Contact details + message form
- `css/style.css`       — All styling (colors, fonts, layout are CSS variables)
- `js/script.js`        — Nav, hero slider, gallery filter + lightbox, forms
- `assets/logo.jpg`     — Extracted JCC logo
- `assets/hero/`        — One background photo per page banner
- `assets/gallery/`     — Photos used across the activity pages
- `assets/gallery/career/` — Photos from the Career Guidance Day
- `assets/documents/`   — Downloadable reports (e.g. the Career Guidance Day report)
- `assets/team/`        — Team member photos
- `assets/partners/`    — Partner organisation logos

## How the Activities section works
`activities.html` is a hub page — it doesn't show photos itself, just a
grid of clickable topic cards. Each card links to its own standalone page:

| Page | Topic |
|---|---|
| `activity-picture-my-rights.html` | Picture My Rights campaign |
| `activity-career-guidance.html` | Career Guidance (full report + photos) |
| `activity-community-outreach.html` | Community Outreach |
| `activity-creative-workshops.html` | Creative Workshops |
| `activity-drama-performance.html` | Drama & Performance |
| `activity-volunteers.html` | Our Volunteers |

Each of these pages has its own photo gallery (with lightbox), and a
**"Latest updates"** section near the bottom — a simple dated log. To add
future information to an activity (a new session, new photos, a document),
open that activity's own page and follow the instructions in the HTML
comment just above `.update-list`: copy one `<div class="update-item">`
block, paste it as the newest (topmost) entry, and edit the date/heading/
text. Nothing else on the page needs to change.

To add a brand-new activity topic: duplicate the structure of an existing
`activity-*.html` file, save it under a new filename, then add a matching
`<a class="topic-card">` block to the grid in `activities.html` linking to it.

### The Career Guidance page
This page is filled in with the real Zengeza 1 High School Career
Guidance Day (22 May 2026) — the full write-up, a quick-facts row, the
rights themes drawn from the "Picture My Rights" mural, all 10 event
photos with a lightbox, a downloadable copy of the original activity
report (`assets/documents/JCC-Career-Guidance-Day-Report.docx`), and the
first "Latest updates" entry. Add future Career Guidance Days the same
way as any other update.

## Swapping background photos
Every hero banner uses an inline style like:
`style="background-image:url('assets/hero/about-hero.jpg');"`
To change a photo: either replace that file inside `assets/hero/` with a
same-named image, or edit the `url('...')` path to point at any other
image (including ones in `assets/gallery/`). The homepage hero is a
3-slide slider — each `.hero-slide` in `index.html` works the same way;
add more slides by copying a whole `<div class="hero-slide">` block.

## Editing a gallery on an activity page
Each photo is a `<figure class="gallery-item">` with:
- an `<img src="assets/gallery/...">` — swap the file to change the photo
- caption text inside `<figcaption>`

Add a new photo by copying a whole `<figure>` block and pointing it at a
new file in `assets/gallery/`. The "#KnowYourConstitution × Zim Daily"
page still uses a placeholder icon graphic (`media-zimdaily-placeholder.jpg`)
— swap that `<img src>` for a real screenshot/photo once the feature is
published, and fill in the real article link in its "Read Article" button.

## Editing the Partners page
Each partner in `partners.html` is a `.card.partner-card` inside a
`.grid-4`. Replace the `<img src="assets/partners/....jpg">` with the
partner's real logo (drop the file into `assets/partners/`), and update
the name and blurb text. Add a new partner by copying a whole
`<div class="card partner-card reveal">...</div>` block.

## Editing the team page
Each card in `team.html` has a `<div class="badge-photo" data-upload>`
placeholder. To add a real photo:
1. Drop the photo file into `assets/team/`.
2. Replace the placeholder icon markup inside that div with:
   `<img src="assets/team/your-photo.jpg" alt="Full Name">`
3. Update the name, role, and bio text.

Tip: open the page in a browser and click any photo circle to preview an
image instantly before committing the edit.

## Colors & fonts
Open `css/style.css` and look at the `:root { ... }` block at the top —
every color and font in the site is a variable there.

## The contact form (already live — one activation step required)
The contact form sends real email using [FormSubmit](https://formsubmit.co)
— a free service that needs no account, no API key, and no server. It
posts straight to `juniorcourtcounsel26@gmail.com` and sets the visitor's
own address as the Reply-To, so replying from Gmail works normally.

**Before it will deliver messages, do this once:** after the site is
live, send one real test message through the form. FormSubmit will email
`juniorcourtcounsel26@gmail.com` an "Activation Required" message —
someone with access to that inbox needs to open it and click
**Activate Form**. Every submission after that arrives automatically.
Until it's activated, submissions won't come through, so don't tell
people the form is ready until you've confirmed that activation email.

To send messages to a different inbox instead, edit the email address in
the form's `action="https://formsubmit.co/ajax/..."` attribute in
`contact.html`. Full details are in the HTML comment right below the form.

## Viewing the site locally
Double-click `index.html`, or in VS Code install the "Live Server"
extension and click "Go Live" for auto-refresh while editing.
