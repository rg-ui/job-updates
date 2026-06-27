# State-Wise Job Filter (Apple Style)

Hum ek interactive state-wise job filter banayenge jo aapke actual scraped data ko filter karega (koi fake data nahi). Jab user kisi state par click karega, to list smoothly filter hogi.

## Proposed Changes

### 1. Data Flow Updates
- `page.tsx` abhi saara data fetch karta hai aur seedha render karta hai. Ye ek Server Component hai.
- Hum ek naya Client Component banayenge `StateJobFilter.tsx` aur scraped data usko pass karenge. Isse data server se aayega, lekin filtering client-side (fast aur smooth) hogi.

### 2. State Keyword Mapping (Real Data Filtering)
Kyunki scraped data mein alag se "state" ka tag nahi hota, hum keyword matching logic use karenge:
- **UP:** "UP", "UPPSC", "UPSSSC", "Uttar Pradesh"
- **Bihar:** "Bihar", "BPSC", "BSSC"
- **Rajasthan:** "Rajasthan", "RPSC", "RSMSSB"
- **MP:** "MP", "MPPSC", "Madhya Pradesh"
- **Delhi:** "Delhi", "DSSSB"
- **All India (Central):** "UPSC", "SSC", "Railway", "IBPS"

### 3. Apple-Style Design & "Map/Filter Animation"
- **Framer Motion Library:** "Apple-style" fluid spring animations aur layout transitions ke liye main `framer-motion` install karne ka propose karta hu. Ye industry standard hai smooth animations ke liye.
- **UI Design:** Ek horizontal scrollable animated pill-bar banayenge (iOS style). Jab state change hoga, to neeche jobs ki list ek smooth spring animation ke sath filter hogi (map/grid reposition animation).

### 4. Components

#### [MODIFY] `src/app/page.tsx`
- Data fetch karke `StateJobFilter` component ko pass karna.

#### [NEW] `src/components/StateJobFilter.tsx`
- Client Component (`"use client"`).
- Isme states ka list hoga aur animation handle hoga.
- Agar koi state select hota hai, to original data mein se sirf wahi jobs dikhengi jinke naam mein state ka keyword ho.

## User Review Required

> [!IMPORTANT]
> - "Apple style map animation" ke liye main ek animated Interactive Grid / Filter Bar banaunga with smooth layout animations (kyunki pura SVG India map code karna thoda heavy/slow ho sakta hai aur mobile pe utna accha nahi lagta). Kya ye animated filter layout design chalega?
> - Kya main `framer-motion` package install kar lu super-smooth Apple-like animations ke liye?
