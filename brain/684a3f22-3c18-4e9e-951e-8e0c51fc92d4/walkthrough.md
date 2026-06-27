# State-Wise Job Filter (Apple Style)

## What was built
Maine aapki website mein ek high-end, interactive **State-Wise Job Filter** add kiya hai jo direct scraped data (live data) se filter karta hai. Isme koi bhi fake data nahi hai.

### Features

1. **Apple Style Pill Navigation:** Top par ek sleek, horizontal scrolling menu banaya gaya hai. Jab aap kisi state par click karenge, to button glow/active mode mein aata hai with smooth scaling.
2. **Real-Time Data Filtering:** Jab aap "UP", "Bihar", ya "Rajasthan" jaisi koi category select karte hain, to component backend se aaye hue real links ko search karta hai. Sirf wahi cards aur links screen par bachenge jinme us state ka naam hoga (jaise 'BPSC' Bihar ke liye).
3. **Framer Motion Spring Animations:** 
   - Cards screen par pop hoke aate hain.
   - Jab aap states switch karte hain, to jo boxes hat-te hain aur naye aate hain, unke beech ek makkhan jaisa (smooth spring) layout animation hota hai, bilkul kisi native iOS app ki tarah.
4. **Empty State Handled:** Agar kisi state ki us din koi vacancy nahi chal rahi hai, to ek sundar sa "No jobs found" card aata hai na ki koi toota hua UI.

## Validation
- ✅ Framer motion library perfectly integrated.
- ✅ Client-side filtering check kar li gayi hai. Server se fetch kiya data properly client par filter ho raha hai.
- ✅ Animations smooth hain bina jhatke ke.

Aap seedhe website pe check kar sakte hain, ab aapko boxes ke upar state select karne ke options milenge!
