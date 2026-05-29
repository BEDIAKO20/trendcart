========================================================================
TrendCart Fashion Store
University E-Business Architecture Assignment
========================================================================

TECHNOLOGY
----------
- HTML5 (semantic structure)
- CSS3 (external stylesheet only: css/style.css)
- Vanilla JavaScript (js/search.js)
- No React, Node.js, databases, or server-side code.
- Tested for Google Chrome and Microsoft Edge.

FOLDER STRUCTURE
----------------
TrendCart/
  index.html      -> Home page (hero video, featured products, promo, social feed, newsletter, audio)
  products.html   -> Shop page (12 products, live JS search + category filter)
  about.html      -> Company story, mission & vision, team, testimonials
  contact.html    -> Contact form, info, social links, Google Maps embed
  cart.html       -> Shopping cart, quantity selectors, live totals, checkout
  faq.html        -> Accordion FAQ (JavaScript)
  css/style.css   -> Single external stylesheet (Flexbox, Grid, media queries)
  js/search.js    -> Menu toggle, search, FAQ accordion, cart controls
  images/         -> (place your own images here if desired)
  videos/         -> Place "fashion.mp4" here for the hero background video
  audio/          -> Place "promo.mp3" here for the promotional audio player

HOW TO RUN
----------
Simply open index.html in Google Chrome or Microsoft Edge.
All pages are interlinked through the navigation bar and footer.

PLACEHOLDER MEDIA
-----------------
1. PRODUCT / TEAM / FEED IMAGES:
   All fashion images are bundled locally inside the /images folder, so
   the pages display correctly offline. Replace any file with your own
   image of the same name to customise the look.

2. HERO BACKGROUND VIDEO (videos/fashion.mp4):
   A reference is included in index.html. Drop any short MP4 clip named
   "fashion.mp4" into the /videos folder. The video autoplays, is muted,
   and loops as required. A dark overlay keeps the headline readable.

3. PROMOTIONAL AUDIO (audio/promo.mp3):
   Drop any MP3 named "promo.mp3" into the /audio folder for the audio
   player on the home page.

FEATURES CHECKLIST
------------------
[x] Responsive navigation (horizontal desktop / vertical mobile via media queries)
[x] Search bar on every page (redirects to products page filter)
[x] Footer + social media icons (Facebook, Instagram, TikTok, X/Twitter) on every page
[x] Hero section with autoplay, muted, looping background video
[x] Featured products + responsive product grid (CSS Grid)
[x] Promotional banner
[x] Social media feed section + embedded newsfeed placeholder
[x] Newsletter subscription form
[x] Promotional audio section
[x] Products page: 12 products, image/name/price/add-to-cart, hover effects, JS filter
[x] About page: story, mission & vision, team, testimonials
[x] Contact page: form, Google Maps embed, phone, email, social links
[x] Cart page: summary cards, quantity selectors, live totals, checkout button
[x] FAQ page: JavaScript accordion
[x] Accessibility: alt text, keyboard focus styles, high-contrast colors,
    form labels, skip link, ARIA attributes
[x] Modern UI: border-radius, hover effects, transitions, box shadows
[x] Responsive at 1024x768 with no horizontal scrolling
[x] Smooth scrolling + Font Awesome icons
========================================================================
