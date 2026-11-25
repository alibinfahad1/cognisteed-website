# CogniSteed — Corporate Website (AR / EN) · v2

A static, bilingual (Arabic RTL / English LTR) corporate website for **CogniSteed — Consulting, Training & Business Solutions**.

- No build step, npm, Node.js, backend or database.
- Typography: **Tajawal** (Google Fonts, `display=swap`) is the only typeface, with a system fallback. Weights: 900 for hero headlines, 800 for section titles, 700 for subheadings, navigation and buttons, 500 for secondary text and 400 for body. Charts, forms, dialogs and the assistant use it too.
- Plain HTML5, CSS3, vanilla JavaScript, SVG and Canvas.
- Chart.js 4.4.1 comes from a pinned jsDelivr URL with Subresource Integrity. It loads only when a chart is about to be shown.
- All paths are relative, so the site runs from a GitHub Pages project URL (`https://<user>.github.io/<repo>/`) or from a custom domain.

All corporate content comes from the original cognisteed.com, in Arabic and from `/en/`. That covers the services, story, vision, mission, values, methodology, industries, smart solutions, knowledge center, "Trusted by" logos and contact details. The logo, horse artwork and partner logos are the original site's own assets. No clients, testimonials or statistics were invented.

---

## 1. Deploy to GitHub Pages

1. Create a repository and upload **the contents of this folder** to its root: `index.html`, `assets/`, `404.html`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `site.webmanifest` and `README.md`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch** and **Branch: `main` / `/ (root)`**. Save.
4. After about a minute the site is live at `https://<user>.github.io/<repo>/`.

**Custom domain (`www.cognisteed.com`):** add the domain under Settings → Pages → Custom domain, then create a `CNAME` DNS record at your DNS provider that points to `<user>.github.io`. GitHub creates the `CNAME` file for you.

> `canonical`, `hreflang`, `og:image`, JSON-LD, `robots.txt` and `sitemap.xml` already point to `https://alibinfahad1.github.io/cognisteed-website/`. If you deploy to a different domain, update those absolute URLs. They are in `index.html` (`<head>`), `robots.txt` and `sitemap.xml`.

**Run locally:** open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
```

---

## 2. Activate the consultation form (important)

The form **never fakes a successful submission**.

- **Default (no endpoint):** after validation, the visitor is told plainly that online submission is not active and that nothing was sent. They then get two honest options:
  - open their own email app with the request pre-written to `info@cognisteed.com`;
  - copy the request text.
- **With an endpoint:** edit `assets/js/config.js`:

```js
window.CS_CONFIG = {
  FORM_ENDPOINT: "https://formspree.io/f/XXXXXXX", // or Basin, Getform, your own API…
  FORM_SEND_FILE: true,      // set false if the endpoint can't take file uploads
  CONTACT_EMAIL: "info@cognisteed.com",
  MAX_FILE_MB: 10
};
```

The form POSTs `multipart/form-data` with the header `Accept: application/json`.

- **Success** is shown only for an HTTP **2xx** response. If the JSON response contains `id`, `reference` or `request_id`, that value is shown as the request number.
- **Any error or timeout** (30 s) shows a failure message, a retry button and the email/copy fallback.

Fields sent: `name, organization, job_title, email, mobile, sector, service, timeframe, budget, message, language, consent, _subject, attachment (optional)`. A hidden honeypot field blocks simple bots.

---

## 3. Project structure

```
index.html              Page markup. Arabic copy lives here (default language, best for SEO).
404.html                GitHub Pages "not found" page.
robots.txt  sitemap.xml  site.webmanifest  .nojekyll
assets/
  css/styles.css        Design system, layout, RTL/LTR, responsive, print and reduced-motion rules.
  img/                  Original CogniSteed assets: horse.webp, mark.webp, partner logos.
  js/config.js          Form endpoint and contact settings (edit this).
  js/i18n.js            English copy (keyed by data-i18n) plus bilingual data for the interactive modules.
  js/horse-points.js    Hero geometry, sampled from the original logo artwork (assets/img/horse.webp).
  js/main.js            Language switching, navigation, scroll progress, reveal, parallax, magnetic buttons,
                        3D tilt cards, service details, methodology timeline, industries, knowledge filter, notices.
  js/hero.js            Canvas "digital steed": particles that assemble the logo horse, network lines,
                        signal pulses and cursor interaction. Pauses when off-screen.
  js/dashboards.js      Demo dashboards: PMO, Insights, Learning and AI Advisory (Chart.js).
  js/diagnostic.js      Multi-step strategic diagnostic: rules, radar chart, printable report.
  js/assistant.js       Floating rule-based guide. Not AI, and nothing leaves the browser.
  js/form.js            Validation and honest submission handling.
  js/ecosystem.js       Interactive SVG map of the six pillars (hover/focus/keyboard, opens the service card).
  js/motion.js          v2 motion layer: intro curtain, decorative cursor, eased anchor scrolling,
                        scroll-lit statement, pinned story sequence, section index rail, hero spotlight.
```

---

## 4. Editing content

- **Arabic text:** edit it directly in `index.html`.
- **English text:** edit the same key in `assets/js/i18n.js` → `CS_I18N.en`. For example, `data-i18n="about.title"` matches `"about.title"`.
- **Lists used by interactive modules** (services, sectors, timeframes, challenges, methodology phases and deliverables): edit them in `CS_DATA` in `i18n.js`. Both languages sit side by side.
- **Language selection order:**
  1. the `?lang=en` or `?lang=ar` URL parameter;
  2. the visitor's saved choice (localStorage);
  3. Arabic.
- **Cache busting:** after editing CSS or JS, bump `?v=2.2.1` in `index.html`. Browsers and GitHub's CDN then fetch the new files.

---

## 5. Interactive features

| Feature | Notes |
|---|---|
| v2 experience layer | A branded intro curtain. A branded wipe during the Arabic/English switch. A decorative cursor ring on mouse devices; the native cursor is kept. Eased anchor scrolling that any wheel, touch or key input cancels. A sliding nav indicator and a section index rail. Film grain on dark sections. Section titles revealed through a mask. Buttons that fill and swap arrows on hover. |
| v2.1 interactions | An interactive SVG map of the six pillars (auto-tour, keyboard support, opens the matching card). Click or tap shockwaves on the hero steed, with network nodes that light up near the cursor. A progress ring in the methodology panel. Dark sections open up as they scroll into view. Magnetic buttons whose label travels further than the button. Dashboard KPIs that count up, PMO table rows linked to the chart, and a CSV export of the clearly labelled demo data. On mobile: swipeable service and article rails with position dots, and scrollable dashboard tabs. |
| Storytelling | The About statement lights up word by word as you scroll. On large screens the name story is pinned and assembles “Cogni + Steed = CogniSteed” step by step. In the hero, the steed scatters into the network as you scroll away. A closing “Strategic Clarity. Decisive Momentum.” band and a giant footer wordmark round off the page. |
| Cinematic hero | A Canvas particle constellation assembles the CogniSteed horse from the logo. Includes network lines, travelling signal pulses, cursor repulsion and a connected ambient field. Mouse and scroll add parallax. The original artwork is revealed faintly beneath. |
| Motion | Staggered headline, scroll progress bar, glass navigation that hides on scroll, reveal-on-scroll, magnetic buttons, 3D tilt service cards with expandable details, scroll-drawn methodology timeline. |
| Bilingual | Full AR ⇄ EN switch without reload: direction, fonts, title, meta, charts, diagnostic and assistant. The choice is remembered. |
| Demo dashboards | PMO, Insights, Learning (Kirkpatrick) and AI Advisory, with filters and charts. **Every dashboard is labelled as fictional sample data.** |
| Strategic diagnostic | Five steps, six pillars, transparent rule-based scoring (explained on the results screen), radar chart, service recommendations, suggested starting phase. Can be printed or saved as PDF, and can pre-fill the consultation form. |
| Guide | Keyword rules in Arabic and English. It states clearly that it is not live AI and sends no data. |
| Notices | Privacy, terms and cookie notices describe only what this website technically does. Full legal policies are marked as pending approval. |

---

## 6. Accessibility, performance and SEO

- **Accessibility:**
  - semantic landmarks and a skip link;
  - one `h1` with no skipped heading levels;
  - labelled controls and ARIA tabs with keyboard arrow navigation (RTL-aware);
  - `aria-live` status messages and visible focus rings;
  - validation errors linked with `aria-describedby`;
  - dialogs closable with Esc;
  - colour contrast checked against the brand palette.
- **Reduced motion:** with `prefers-reduced-motion`:
  - the curtain, wipe and cursor are removed;
  - the story isn't pinned, and the statement is fully lit;
  - the hero renders one static frame;
  - reveals and the marquee are disabled;
  - tilt and magnetic effects are turned off.
- **Performance:**
  - fonts load without blocking rendering, with `display=swap`;
  - Chart.js is lazy-loaded with SRI;
  - images are lazy-loaded with fixed dimensions;
  - the hero canvas caps DPR at 1.75, draws in batches and pauses off-screen or in background tabs;
  - there are no frameworks.
- **SEO:**
  - descriptive title and meta tags per language;
  - canonical and `hreflang` links;
  - Open Graph tags;
  - JSON-LD `ProfessionalService`;
  - `robots.txt` and `sitemap.xml`.

Run Lighthouse in Chrome DevTools (Incognito, "Mobile" and "Desktop") after deployment to confirm scores in your hosting environment. Third-party font and CDN latency affects the results.

---

## 7. Content still to be supplied by CogniSteed

These items are kept exactly as the original site presents them and should be completed by the company:

- Commercial Registration number (shown as "to be added after verification").
- Full street address (the original lists Riyadh only).
- Knowledge Center articles (marked "Coming soon"; "Notify me" opens an email to info@cognisteed.com).
- Final legal Privacy Policy, Terms and Cookie Policy.
- Smart Solutions remain labelled "In development", as on the original site.

---

## 8. Production notes (v2.2)

- **Content-Security-Policy** is set by a `<meta>` tag in `index.html`, because GitHub Pages can't send custom headers. It allows only:
  - this site;
  - `cdn.jsdelivr.net` for Chart.js (pinned and SRI-checked);
  - Google Fonts;
  - `formspree.io` for the form.

  The single inline `<script>` in `<head>` and the font `onload` handler are allowed **by hash**. If you edit that inline script, recompute its SHA-256 hash and update `script-src`. Otherwise the language and reduced-motion bootstrap will be blocked.
- **Formspree activation:** see `assets/js/config.js`. Paste the verified endpoint into `FORM_ENDPOINT`. File uploads stay off (`FORM_SEND_FILE: false`) because Formspree's free plan doesn't accept them. After a successful submission, the visitor is told the file wasn't attached and is given an email link for it.
- **Social sharing:** `assets/img/og-cognisteed.png` (1200 × 630) was built from the original logo artwork and copy. The app icons in `assets/img/icons/` are PNGs at 32, 180, 192 and 512 px.
- **Client logos** are WebP (about 44 KB in total, down from about 104 KB as PNG).
- **SEO:** the canonical link and `og:url` refer to the page itself for each language (`/` and `/?lang=en`). The sitemap lists both language URLs, with `hreflang` alternates and the OG image.
- **Legal pages:** bilingual Privacy Policy and Terms drafts are kept **outside this repository** (`../cognisteed-legal-drafts/`). They are not published until approved and completed: CR number, registered address, retention period and legal review. The footer currently opens technical notices that describe only what the website does.
