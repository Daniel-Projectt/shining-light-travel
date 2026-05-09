# Shining Light Travel — Website

**Advisor:** Misty Vergakis, Luxury Travel Advisor  
**Stack:** Plain HTML · CSS · JavaScript (no build tools required)

---

## Preview

```bash
cd ~/OneDrive/Desktop/Personal\ Projects/Shining\ Light\ Travel
npx serve .
```

Then open **http://localhost:3000** in your browser.

> Requires Node.js installed. If `npx serve` isn't available, run `npm install -g serve` first.

---

## File Structure

```
Shining Light Travel/
├── index.html          ← Full site (single page)
├── css/
│   └── style.css       ← All styles + responsive breakpoints
├── js/
│   └── main.js         ← Nav scroll, parallax, fade-in, form, mobile menu
├── assets/
│   ├── Logo_and_font_final_polish_gold_2.png   ← Primary logo (gold, on navy)
│   └── Logo_and_font_final_polish.png          ← Black logo (light backgrounds)
└── README.md
```

---

## Swapping the Logo

Drop replacement files into `assets/` using the exact same filenames:

| File | Used for |
|------|---------|
| `Logo_and_font_final_polish_gold_2.png` | Nav bar + Footer (gold version) |
| `Logo_and_font_final_polish.png` | Light-background lockup (if needed) |

The logo renders at `max-height: 60px` in the nav and `max-height: 80px` in the footer — aspect ratio is preserved automatically.

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Logo Gold | `#F2C94C` | Primary accent — buttons, borders, hover |
| Logo Gold Deep | `#D4A017` | Hover states, active borders |
| Navy Primary | `#0B1F3A` | Main backgrounds, sections |
| Navy Mid | `#162D50` | Card backgrounds, form areas |
| Navy Light | `#1E3A5F` | Subtle panels |
| Navy Deep | `#080F1E` | Footer background |
| Cream | `#FAF7F0` | Light section backgrounds, body text areas |
| Warm White | `#FFFFFF` | Card text, nav text |

---

## Font Stack

| Role | Font | Weights |
|------|------|---------|
| Display / Headlines | Cormorant Garamond | 300, 400, 500, 600 + italic |
| Subheadings | Cinzel | 400, 500, 600 |
| Body | Raleway | 300, 400, 500, 600 |

All loaded via Google Fonts — no install required.

---

## Replacing Misty's Photo

The "MV" monogram box in the About section is a placeholder.  
To replace it with a real photo:

1. Add your image to `assets/` (e.g. `misty-headshot.jpg`)
2. In `index.html`, find the `.about__photo-placeholder` div and replace with:

```html
<img src="assets/misty-headshot.jpg" alt="Misty Vergakis" class="about__photo-img" />
```

3. Add this rule to `css/style.css`:

```css
.about__photo-img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  object-position: top;
}
```

---

## Going Live (Free Hosting via Netlify)

1. Go to [netlify.com](https://netlify.com) and create a free account
2. Drag and drop the entire `Shining Light Travel` folder onto the Netlify deploy zone
3. Netlify gives you a free `*.netlify.app` URL instantly
4. To use a custom domain (e.g. `shininglighttravel.com`):
   - Add your domain in **Site Settings → Domain Management**
   - At your domain registrar, set an **A record** pointing to Netlify's load balancer IP: `75.2.60.5`
   - Or use a **CNAME** pointing to your Netlify subdomain

---

## Contact Form

The form currently shows a success message client-side only (no data is sent anywhere).  
To wire it to a real backend, replace the form submit handler in `js/main.js` with a `fetch()` call to:
- **Netlify Forms** (add `netlify` attribute to the `<form>` tag — zero config)
- **Formspree** (`action="https://formspree.io/f/YOUR_ID"`)
- Any custom endpoint
