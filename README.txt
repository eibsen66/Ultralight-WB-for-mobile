W&B for Ultralight Version 2.02 by Egill Ibsen (Web) - Multi-aircraft

Live site (GitHub Pages):
https://eibsen66.github.io/Ultralight-WB-for-mobile/

WHAT THIS IS
A simple weight and balance (W&B) calculator for ultralight aircraft.
It computes:
- Total weight (kg)
- Total moment (kg*m)
- CG position (m forward of datum, FoD)
- CG index (moment / index divisor)
It also draws a W&B chart and can Print/Export a one-page loadsheet (PDF).

SIGN CONVENTION / DATUM
- Datum is defined in Aircraft data (commonly the main wheel axle line).
- FoD (forward of datum) is positive.
- AoD (aft of datum) is negative (use negative arm values).

A/C TYPE (AIRCRAFT TYPE)
Use the A/C Type dropdown:
- Skyranger Nynja 600: preset W&B data auto-filled.
- ICP Savannah / Zenith 701 / Zenith 750: blank by default (user must fill Aircraft data).
- Add Aircraft type...: lets you add your own aircraft type (free).
All values are stored in your browser (local storage) on that device.

AIRCRAFT REGISTRATION
Aircraft Registration prints in bold at the top center of the printed/PDF loadsheet.

EMPTY BASELINE (FROM WHEEL LOADS)
If your datum is the main wheel axle line (arm 0 for both mains):
- Total empty weight = nose (or tail) + left main + right main
- Total empty moment = (nose_or_tail_load * wheel_arm) + (left_main * 0) + (right_main * 0)
This is why only the nose/tail wheel contributes to moment when main wheel arms are 0.

TAILWHEEL MODE
If Tailwheel is checked:
- The wheel input label changes to "Tail wheel wt (kg)".
- The Aircraft data section opens automatically.
- IMPORTANT: Tailwheel mode only changes labels. You must enter the correct wheel arm in Aircraft data.
  The wheel arm field is shown in red until changed.

TANDEM (FRONT/REAR) TWO-SEATERS (NOTE)
Tandem aircraft use the same math. The only difference is seat arms:
- Front seat arm and rear seat arm are different.
Moment is always weight * arm, and CG is total moment / total weight.
To support tandem aircraft, set two separate seat arms in Aircraft data:
- Pilot seat arm = front seat arm (or rear, depending on your layout)
- Passenger seat arm = the other seat arm
For side-by-side aircraft the two seat arms are usually the same.

AIRCRAFT DATA (IMPORTANT FOR NON-PRESET TYPES)
For aircraft types other than the Skyranger Nynja 600 preset, you MUST fill Aircraft data:
- MTOW (kg)
- CG limits (m FoD)
- Wheel arm (nose or tail wheel arm, m FoD)
- Seat arms (pilot and passenger)
- Fuel arm, baggage arm
- Fuel density (kg/L) and fuel capacity (L)
- Index divisor (if used; otherwise leave at 1)

PRINT / EXPORT
Use Print/Export Loadsheet (PDF) to create a one-page loadsheet with:
- Results text
- W&B chart
On iPad: Print -> Save as PDF (or Share).

UPDATING / STUCK ON AN OLD VERSION (CACHE)
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

UPDATE NOTE
Skyranger Nynja 600 preset CG fwd limit is 0.367 m FoD.

DISCLAIMER
This calculator is provided for convenience only.
You are responsible for verifying all inputs and results against the approved data for your aircraft.
Use at your own risk. The author accepts no liability for any loss, damage, injury, or death resulting from use of this tool.
