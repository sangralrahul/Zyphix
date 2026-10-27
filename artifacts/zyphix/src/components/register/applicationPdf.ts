/* ────────────────────────────────────────────────────────────────────────────
   Branded "copy of your application" for every partner sign-up.
   Opens a preview page with a live animated background and a Save-as-PDF button.
   The printed / saved PDF is the clean A4 sheet only (print CSS drops the animation).
──────────────────────────────────────────────────────────────────────────── */

export type PdfTrack = 'store' | 'restaurant' | 'delivery' | 'service';

const TRACK: Record<PdfTrack, { label: string; product: string; accent: string; code: string }> = {
  store: { label: 'Store partner application', product: 'Zyphix Now', accent: '#0DA366', code: 'S' },
  restaurant: { label: 'Restaurant partner application', product: 'Zyphix Eats', accent: '#E11D48', code: 'R' },
  delivery: { label: 'Delivery partner application', product: 'Zyphix Delivery', accent: '#0DA366', code: 'D' },
  service: { label: 'Service professional application', product: 'Zyphix Book', accent: '#7C3AED', code: 'B' },
};

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function exportApplicationPDF(opts: {
  track: PdfTrack;
  /** business or person name shown big on the sheet */
  title: string;
  sections: { heading: string; rows: [string, string | undefined][] }[];
  tags?: { heading: string; items: string[] };
  nextSteps: string[];
}) {
  const t = TRACK[opts.track];
  const ref = `ZX-${t.code}-${Date.now().toString(36).toUpperCase()}`;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const origin = location.origin;

  const sections = opts.sections.map(s => `
    <section class="sec">
      <h3>${esc(s.heading)}</h3>
      <dl>${s.rows.filter(([, v]) => v && String(v).trim()).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </section>`).join('');

  const tags = opts.tags && opts.tags.items.length ? `
    <section class="sec">
      <h3>${esc(opts.tags.heading)} <span class="count">${opts.tags.items.length}</span></h3>
      <div class="tags">${opts.tags.items.map(i => `<span>${esc(i)}</span>`).join('')}</div>
    </section>` : '';

  const steps = ['Application received', ...opts.nextSteps].map((s, i) => `
    <li class="${i === 0 ? 'done' : i === 1 ? 'next' : ''}"><span class="dot">${i === 0 ? '&#10003;' : i + 1}</span><span class="txt">${esc(s)}${i === 0 ? `<em>${esc(date)}, ${esc(time)}</em>` : i === 1 ? '<em>Up next</em>' : ''}</span></li>`).join('');

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(t.label)} · ${esc(opts.title)} · Zyphix</title>
<style>
@font-face{font-family:'Geist';src:url('${origin}/fonts/geist-latin.woff2') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'Instrument Serif';src:url('${origin}/fonts/instrument-serif-italic.woff2') format('woff2');font-style:italic;font-display:swap}
@font-face{font-family:'Outfit';src:url('${origin}/fonts/outfit-900.woff2') format('woff2');font-weight:900;font-display:swap}
:root{--acc:${t.accent};--ink:#0B0F19}
*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%}
body{font-family:'Geist',system-ui,-apple-system,'Segoe UI',Arial,sans-serif;color:var(--ink);background:#05080E;-webkit-print-color-adjust:exact;print-color-adjust:exact}

/* ── live background (screen only) ── */
.bg{position:fixed;inset:0;overflow:hidden;z-index:-1;pointer-events:none}
.bg .b{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55;animation:float 18s ease-in-out infinite alternate}
.bg .b1{width:60vmax;height:60vmax;left:-15vmax;top:-20vmax;background:var(--acc)}
.bg .b2{width:45vmax;height:45vmax;right:-12vmax;top:10vmax;background:#34D399;animation-duration:22s;animation-delay:-6s;opacity:.35}
.bg .b3{width:40vmax;height:40vmax;left:20vmax;bottom:-22vmax;background:#2563EB;animation-duration:26s;animation-delay:-12s;opacity:.25}
.bg .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at 50% 30%,#000 30%,transparent 75%);animation:pan 40s linear infinite}
.bg .spark{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:0;animation:spark 6s ease-in-out infinite}
@keyframes float{0%{transform:translate(0,0) scale(1)}50%{transform:translate(6vmax,4vmax) scale(1.08)}100%{transform:translate(-4vmax,8vmax) scale(.95)}}
@keyframes pan{to{background-position:56px 56px,56px 56px}}
@keyframes spark{0%,100%{opacity:0;transform:translateY(0)}40%{opacity:.8}80%{opacity:0;transform:translateY(-60px)}}
@keyframes rise{from{opacity:0;transform:translateY(40px) scale(.98)}to{opacity:1;transform:none}}
@keyframes fadein{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}

.bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 24px;color:#fff;animation:fadein .6s ease both}
.bar p{font-size:14px;color:rgba(255,255,255,.75)}
.bar p b{color:#fff;font-weight:600}
.btns{display:flex;gap:10px}
.btn{appearance:none;border:0;cursor:pointer;font:600 14.5px/1 'Geist',system-ui,sans-serif;height:44px;padding:0 20px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:transform .15s ease,box-shadow .2s ease}
.btn:hover{transform:translateY(-1px)}
.btn.primary{background:var(--acc);color:#fff;box-shadow:0 14px 34px -12px var(--acc)}
.btn.ghost{background:rgba(255,255,255,.1);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);backdrop-filter:blur(8px)}

.stage{position:relative;z-index:2;isolation:isolate;display:flex;justify-content:center;padding:8px 16px 64px}
.paper{width:210mm;min-height:297mm;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 60px 120px -40px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.06);animation:rise .9s cubic-bezier(.22,1,.36,1) .15s both;display:flex;flex-direction:column}

/* ── sheet ── */
.head{position:relative;background:#05080E;color:#fff;padding:34px 44px 30px;overflow:hidden}
.head:after{content:'';position:absolute;inset:auto -10% -60% auto;width:340px;height:340px;border-radius:50%;background:var(--acc);filter:blur(70px);opacity:.45}
.brand{position:relative;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:10px}
.mark{width:34px;height:34px;border-radius:9px;background:linear-gradient(160deg,#19C27C,#0DA366);display:flex;align-items:center;justify-content:center;color:#fff;font:900 italic 16px 'Outfit',Arial,sans-serif;letter-spacing:-1px;box-shadow:0 8px 20px -6px rgba(13,163,102,.7)}
.word{font:900 italic 21px 'Outfit',Arial,sans-serif;letter-spacing:-.03em}
.word i{font-style:italic;color:#34D399}
.status{font-size:11.5px;font-weight:600;letter-spacing:.04em;padding:6px 12px;border-radius:999px;background:rgba(52,211,153,.14);color:#6EE7B7;box-shadow:inset 0 0 0 1px rgba(110,231,183,.3)}
.kicker{position:relative;margin-top:30px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#6EE7B7}
.title{position:relative;margin-top:8px;font-size:32px;font-weight:600;letter-spacing:-.035em;line-height:1.05}
.title em{font-family:'Instrument Serif',Georgia,serif;font-weight:400;color:#6EE7B7}
.meta{position:relative;margin-top:18px;display:flex;flex-wrap:wrap;gap:8px 22px;font-size:12px;color:rgba(255,255,255,.65)}
.meta b{color:#fff;font-weight:600;font-variant-numeric:tabular-nums}
.stripe{height:4px;background:linear-gradient(90deg,var(--acc),#34D399)}

.body{padding:30px 44px 10px;flex:1}
.sec{margin-bottom:26px;break-inside:avoid}
.sec h3{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;padding-bottom:10px;border-bottom:1px solid #EEF0F3;margin-bottom:12px}
.count{font-size:10.5px;letter-spacing:0;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--acc) 10%,white);color:var(--acc)}
dl{display:grid;grid-template-columns:1fr 1fr;gap:12px 28px}
dl div{min-width:0}
dt{font-size:11.5px;color:#6B7280;margin-bottom:3px}
dd{font-size:14px;font-weight:500;color:#111827;word-wrap:break-word}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tags span{font-size:12px;font-weight:500;padding:5px 11px;border-radius:999px;background:#F6F7F9;box-shadow:inset 0 0 0 1px #E5E7EB;color:#374151}
ol{list-style:none;position:relative}
ol li{position:relative;display:flex;gap:12px;padding-bottom:14px;font-size:13.5px;color:#4B5563}
ol li:not(:last-child):before{content:'';position:absolute;left:11px;top:24px;bottom:0;width:1px;background:#E5E7EB}
ol li.done:before{background:var(--acc)}
.dot{flex:none;width:23px;height:23px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:#F3F4F6;color:#6B7280}
li.done .dot{background:var(--acc);color:#fff}
li.next .dot{background:#fff;color:var(--acc);box-shadow:inset 0 0 0 2px var(--acc)}
li.done .txt,li.next .txt{color:#111827;font-weight:500}
.txt em{display:block;font-style:normal;font-size:11.5px;color:#9CA3AF;margin-top:1px;font-weight:400}
li.next .txt em{color:var(--acc)}
.foot{margin:10px 44px 0;padding:18px 0 28px;border-top:1px solid #EEF0F3;display:flex;justify-content:space-between;gap:20px;font-size:11px;color:#9CA3AF;line-height:1.55}
.foot b{color:#374151;font-weight:600}
.wm{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:64px;line-height:.9;color:#F1F3F5;text-align:right;padding:0 40px 18px;letter-spacing:-.02em}

@media screen and (max-width:860px){.paper{width:100%;min-height:0}.head,.body{padding-left:24px;padding-right:24px}.foot{margin:10px 24px 0}dl{grid-template-columns:1fr}.bar p{display:none}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
@page{size:A4;margin:0}
@media print{
  body{background:#fff}
  .bg,.bar{display:none!important}
  .stage{padding:0}
  .paper{width:210mm;height:297mm;min-height:0;border-radius:0;box-shadow:none;animation:none}
  .wm{font-size:52px;padding-bottom:12px}
}
</style></head><body>
<div class="bg"><div class="b b1"></div><div class="b b2"></div><div class="b b3"></div><div class="grid"></div>
${Array.from({ length: 18 }, (_, i) => `<span class="spark" style="left:${(i * 53) % 100}%;top:${20 + ((i * 37) % 70)}%;animation-delay:${(i * 0.7) % 6}s"></span>`).join('')}
</div>
<div class="bar"><p><b>Your application copy</b> · Save it as a PDF or print it.</p>
<div class="btns"><button class="btn ghost" onclick="window.close()">Close</button><button class="btn primary" onclick="window.print()">&#8595;&nbsp; Save as PDF</button></div></div>
<main class="stage"><article class="paper">
  <header class="head">
    <div class="brand"><div class="logo"><div class="mark">//</div><div class="word">ZYPH<i>IX</i></div></div><span class="status">&#9679;&nbsp; RECEIVED</span></div>
    <p class="kicker">${esc(t.product)} · ${esc(t.label)}</p>
    <h1 class="title">${esc(opts.title)}<br/><em>application copy</em></h1>
    <div class="meta"><span>Reference <b>${esc(ref)}</b></span><span>Submitted <b>${esc(date)}</b></span><span>Status <b>Under review</b></span></div>
  </header>
  <div class="stripe"></div>
  <div class="body">
    ${sections}
    ${tags}
    <section class="sec"><h3>What happens next</h3><ol>${steps}</ol></section>
  </div>
  <footer class="foot">
    <div><b>Zyphix Partners</b><br/>partnerships@zyphix.in · partner.zyphix.in</div>
    <div style="text-align:right">This is a copy of what you submitted, not a contract.<br/>Keep your reference number for any questions.</div>
  </footer>
  <div class="wm">Zyphix</div>
</article></main>
</body></html>`;

  // A blob URL is a real page (same origin), so fonts and print behave like any normal document.
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const win = window.open(url, '_blank');
  if (!win) {
    // Pop-ups blocked: open in this tab instead so the copy is never lost.
    location.assign(url);
    return;
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
