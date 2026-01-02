W&B for Ultralight Version 2.01 (Web + Phone + Offline PWA) - iPhone fix

If iPhone keeps showing a "print-style" layout:
- This build REMOVES all @media print layout switching.
- Printing now opens a separate loadsheet page in a new tab/window and prints that.

How to print/save PDF:
- Tap "Print/Export Loadsheet (PDF)".
- A new page opens with the loadsheet (results + chart).
- Use Share/Print to Save as PDF.

Popups:
- Printing uses a new window/tab. If Safari blocks popups, allow popups for your site.

Offline (PWA) requirement:
- Service-worker offline caching requires https:// (or http://localhost).
- For real offline after "Add to Home Screen", host on HTTPS (GitHub Pages / Netlify / Cloudflare Pages).

Update note:
- Cache name bumped to force refresh. If you installed an older version, remove it from Home Screen and add again.
