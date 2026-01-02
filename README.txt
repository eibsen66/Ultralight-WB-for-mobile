W&B for Ultralight Version 2.02 by Egill Ibsen (Web) - Multi-aircraft

Live site (GitHub Pages):
https://eibsen66.github.io/Ultralight-WB-for-mobile/

This version includes:
- A/C Type dropdown
  - Skyranger Nynja 600 (preset values auto-filled)
  - ICP Savannah (blank - user fills aircraft data)
  - Zenith 701 (blank - user fills aircraft data)
  - Zenith 750 (blank - user fills aircraft data)
  - Add Aircraft type... (lets users add their own type)
- Aircraft Registration field below the A/C Type
- Tailwheel checkbox (label changes and Aircraft data opens automatically)
- Print/Export Loadsheet (PDF) includes results + chart
- Disclaimer included (use at your own risk)

Aircraft data notes:
- Datum: main wheel axle line (FoD positive, AoD negative)
- For aircraft types other than Skyranger Nynja 600 you MUST fill aircraft data (arms, limits, fuel density/capacity).
- This app does not mark changed preset fields in yellow.

Tailwheel mode:
- If Tailwheel is checked:
  - The wheel input label changes to "Tail wheel wt (kg)".
  - The Aircraft data section opens automatically.
  - IMPORTANT: Tailwheel mode only changes labels. You must enter the correct wheel arm in Aircraft data (Arm tail wheel).
  - The wheel arm field is shown in red until changed.

Offline / Install:
- For offline "Add to Home Screen" / "Install App" behavior, host these files on HTTPS (GitHub Pages works).
- Then open the URL in Safari/Chrome and choose Add to Home Screen / Install App.

Updating / stuck on an old version (cache):
This web app can be cached by:
- browser cache
- offline PWA cache (service worker)
- saved settings (local storage)

iPhone / iPad (Safari)
1) Open the site in Safari (do not open from Google Drive preview).
2) Pull down to refresh.
3) If installed to Home Screen (PWA):
   - Close it (swipe away), open it again.
   - If still old: delete the Home Screen icon and reinstall:
     Share -> Add to Home Screen.
4) If still old: clear website data:
   Settings -> Safari -> Advanced -> Website Data -> search "github.io" -> Delete.

Android (Chrome)
1) Open the site and refresh.
2) If still old:
   Chrome -> Settings -> Site settings -> Storage (or All sites) -> find the site -> Clear and reset.
3) If installed as an app (PWA):
   - Uninstall the app
   - Open the site again in Chrome and reinstall.

Quick workaround (both iOS and Android)
Open the link once with a version parameter:
https://eibsen66.github.io/Ultralight-WB-for-mobile/?v=1
(Change the number any time.)

Files in the web app folder:
- index.html, style.css, app.js
- manifest.webmanifest, sw.js
- icon-192.png, icon-512.png
- README.txt

Update:
- Skyranger Nynja 600 preset CG fwd limit is 0.367 m FoD.

DISCLAIMER:
This calculator is provided for convenience only.
You are responsible for verifying all inputs and results against the approved data for your aircraft.
Use at your own risk. The author accepts no liability for any loss, damage, injury, or death resulting from use of this tool.
