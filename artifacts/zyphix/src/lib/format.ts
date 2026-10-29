/* Number formatting helpers. One shared Intl formatter: creating a NumberFormat is the
   expensive part (tens of milliseconds on a phone), formatting with it is free. */
let nf: Intl.NumberFormat | null = null;
const fmt = () => (nf ??= new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }));

/** 2946 → "2,946" (Indian grouping) */
export const num = (n: number) => fmt().format(n);
/** 1250 → "₹1,250" */
export const inr = (n: number) => `₹${fmt().format(n)}`;
