# Parlay Builder

Random sports prop parlay generator for MLB, NFL, NBA, and NHL.
Live player rosters pulled from ESPN's public API. For entertainment purposes only.

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **ESPN unofficial API** — free, no key required, rosters cached 6 hours
- **Google AdSense** — plug in your publisher ID to monetize
- **Vercel** — free hosting, deploys in ~2 minutes

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (Free)

### One-time setup

1. **Create a GitHub repo** and push this code:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/parlay-builder.git
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** → Sign up with GitHub (free)

3. Click **"Add New Project"** → Import your repo → Click **Deploy**

   That's it. Your site is live at `your-project.vercel.app` in ~2 minutes.

4. **Custom domain** (optional): Buy a domain (~$12/yr at Namecheap), add it in Vercel under Project → Settings → Domains.

### Auto-deploys
Every `git push` to `main` triggers a new deploy automatically.

---

## Enable Google AdSense

1. Sign up at [adsense.google.com](https://adsense.google.com)
2. Add your site URL and wait for approval (usually 1-3 days for new sites)
3. Once approved, get your **Publisher ID** (`ca-pub-XXXXXXXXXXXXXXXX`) and **Ad Slot IDs**
4. In Vercel: Project → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_ADS_ENABLED=true
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   ```
5. In `src/app/layout.tsx`, uncomment the AdSense `<script>` tag and replace the publisher ID
6. In `src/app/page.tsx`, replace `TOP_AD_SLOT_ID`, `MID_AD_SLOT_ID`, `BOTTOM_AD_SLOT_ID` with your real slot IDs from AdSense

**Expected CPM**: Betting/gambling adjacent content typically earns $5–15 CPM (vs $1–2 for general content).

---

## Add Live Odds (Future - V2)

When ad revenue covers the cost:

1. Sign up at [the-odds-api.com](https://the-odds-api.com) — free tier is 500 req/month to test
2. Add to Vercel env vars: `ODDS_API_KEY=your_key`
3. Create `src/app/api/odds/route.ts` to proxy requests (keeps your key server-side)
4. Replace the simulated odds in `parlayEngine.ts` with real lines from DraftKings, FanDuel, etc.

Paid plan that covers props: ~$99/month. At $10 CPM you'd need ~10,000 monthly page views to break even.

---

## Mobile App (Capacitor)

To wrap as a native iOS/Android app:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Parlay Builder" "com.yourname.parlaybuilder"
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios   # opens Xcode
npx cap open android  # opens Android Studio
```

- **iOS App Store**: requires Apple Developer account ($99/year)
- **Google Play**: one-time $25 fee

---

## Project Structure

```
src/
  app/
    page.tsx          # Main UI
    page.module.css   # Styles
    layout.tsx        # Root layout + AdSense script
    globals.css       # Global styles + CSS vars (light/dark mode)
    api/
      roster/route.ts # ESPN roster API proxy
  components/
    AdSlot.tsx        # Google AdSense component
    DualSlider.tsx    # Reusable dual-handle slider
  hooks/
    useRoster.ts      # ESPN roster fetching + caching
  lib/
    types.ts          # TypeScript types
    propData.ts       # Prop definitions + fallback players
    espn.ts           # ESPN API fetching logic
    parlayEngine.ts   # Parlay generation algorithm
```
