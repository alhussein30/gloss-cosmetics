"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import data from "@/content/brand.json";

type Lang = "ar" | "en";
type T = { ar: string; en: string };
type Product = {
  id: string;
  brand: string;
  name: T;
  cat: string;
  count: number;
  blurb: T;
  points: T[];
  tag?: T;
};
type Brand = Omit<typeof data, "products" | "cats" | "faqs" | "highlights" | "stats"> & {
  products: Product[];
  cats: { key: string; ar: string; en: string }[];
  faqs: { q: T; a: T }[];
  highlights: { icon: string; title: T; text: T }[];
  stats: { n: string; label: T }[];
  brands: string[];
  logoSquare?: string;
};
const brand = data as unknown as Brand;

const ui = {
  ar: {
    nav: ["المنتجات", "ليه إحنا", "المحل", "أسئلة"],
    menu: "القائمة",
    close: "إغلاق",
    langBtn: "EN",
    loading: "جاري التحميل",
    heroCta: "اتفرجي على المنتجات",
    heroAsk: "اسألي على منتج",
    shopTitle: "المنتجات",
    shopSub: "كل منتج معاه شرح لاستخدامه. الأسعار بنقولها في الرسايل حسب المتاح.",
    all: "الكل",
    results: (n: number) => `${n} منتج`,
    details: "التفاصيل",
    ask: "اسألي عن السعر",
    askWa: "اسألي على واتساب",
    photos: (n: number) => `${n} صور`,
    why: "ليه تشتري من جلوس؟",
    storeTitle: "المحل",
    storeSub: "تعالي شوفي المنتجات على الطبيعة، أو كلمينا.",
    address: "العنوان",
    hours: "المواعيد",
    phone: "تليفون",
    openMap: "افتحي الخريطة",
    faqTitle: "أسئلة بتتسأل كتير",
    brandsTitle: "ماركات عندنا",
    footerNote: "محل مستحضرات تجميل وعناية بالبشرة في أسيوط.",
    rights: "جميع الحقوق محفوظة",
    waHello: "السلام عليكم، عايزة أسأل عن منتج.",
    waAsk: (p: string) => `السلام عليكم، عايزة أسأل عن: ${p}\nالسعر كام والمتاح إيه؟`,
  },
  en: {
    nav: ["Products", "Why us", "Store", "FAQ"],
    menu: "Menu",
    close: "Close",
    langBtn: "ع",
    loading: "Loading",
    heroCta: "Browse the products",
    heroAsk: "Ask about a product",
    shopTitle: "Products",
    shopSub: "Every product comes with how to use it. Prices are given in messages, based on what is in stock.",
    all: "All",
    results: (n: number) => `${n} products`,
    details: "Details",
    ask: "Ask for the price",
    askWa: "Ask on WhatsApp",
    photos: (n: number) => `${n} photos`,
    why: "Why buy from Gloss?",
    storeTitle: "The store",
    storeSub: "Come and see the products in person, or call us.",
    address: "Address",
    hours: "Hours",
    phone: "Phone",
    openMap: "Open in Maps",
    faqTitle: "Frequently asked",
    brandsTitle: "Brands we stock",
    footerNote: "A cosmetics and skincare store in Assiut.",
    rights: "All rights reserved",
    waHello: "Hello, I would like to ask about a product.",
    waAsk: (p: string) => `Hello, I would like to ask about: ${p}\nWhat is the price and what is available?`,
  },
};

const wa = (text: string) => `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(text)}`;
const img = (id: string, i: number, s: "m" | "l") => `/images/products/${id}-${i}-${s}.webp`;
const ICON = { strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none", stroke: "currentColor" };

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", ...ICON, "aria-hidden": true };
  switch (name) {
    case "verified":
      return <svg {...p}><path d="M12 3l2.3 2.1 3.1-.3.6 3 2.7 1.5-1.4 2.8 1.4 2.8-2.7 1.5-.6 3-3.1-.3L12 21l-2.3-2.1-3.1.3-.6-3L3.3 12.7l1.4-2.8L3.3 7.1l2.7-1.5.6-3 3.1.3z" /><path d="M9 12.3l2 2 4-4.2" /></svg>;
    case "sparkle":
      return <svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" /></svg>;
    case "chat":
      return <svg {...p}><path d="M4 5h16v11H9l-5 4z" /><path d="M9 10h6" /></svg>;
    case "pin":
      return <svg {...p}><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></svg>;
    case "clock":
      return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3 1.8" /></svg>;
    case "phone":
      return <svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></svg>;
    case "menu":
      return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "x":
      return <svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case "arrow":
      return <svg {...p} className="flip"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case "prev":
      return <svg {...p}><path d="M15 5l-7 7 7 7" /></svg>;
    case "next":
      return <svg {...p}><path d="M9 5l7 7-7 7" /></svg>;
    case "ig":
      return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>;
    case "fb":
      return <svg {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>;
    case "plus":
      return <svg {...p}><path d="M12 5v14M5 12h14" /></svg>;
    default:
      return <svg {...p}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z" />
    </svg>
  );
}

function Loader({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const quick = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setHide(true), quick ? 220 : 1500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("loading", !hide);
    return () => document.documentElement.classList.remove("loading");
  }, [hide]);
  return (
    <div className={`loader ${hide ? "gone" : ""}`} onTransitionEnd={onDone} role="status" aria-label={ui[lang].loading}>
      <div className="loader-in">
        <img src={brand.logo} alt="" width={200} height={200} />
        <span className="loader-bar">
          <i />
        </span>
      </div>
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = useState<Lang>((brand.defaultLang as Lang) || "ar");
  const t = ui[lang];
  const [menu, setMenu] = useState(false);
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<Product | null>(null);
  const [shot, setShot] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("lang") as Lang | null;
      if (s === "ar" || s === "en") setLang(s);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  // Reveal fallback where scroll-driven animations are unsupported (Firefox).
  useEffect(() => {
    if (CSS.supports("(animation-timeline: view()) and (animation-range: entry)")) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    setShot(0);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const list = useMemo(() => brand.products.filter((p) => cat === "all" || p.cat === cat), [cat]);
  const tabs = [{ key: "all", ar: "الكل", en: "All" }, ...brand.cats];
  const links = ["#shop", "#why", "#store", "#faq"];
  const hero = [brand.products[0], brand.products[10], brand.products[5]];

  return (
    <>
      <Loader lang={lang} onDone={() => {}} />

      <header className="header">
        <div className="wrap header-in">
          <div className="h-start">
            <button className="icon menu-btn" onClick={() => setMenu(true)} aria-label={t.menu}>
              <Icon name="menu" />
            </button>
            <nav className="nav">
              {t.nav.map((n, i) => (
                <a key={n} href={links[i]}>
                  {n}
                </a>
              ))}
            </nav>
          </div>
          <a href="#top" className="brand" aria-label={brand.name[lang]}>
            <img src={brand.logo} alt="" width={120} height={120} />
          </a>
          <div className="h-end">
            <button className="lang" onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label={lang === "ar" ? "English" : "عربي"}>
              {t.langBtn}
            </button>
            <a className="btn btn-wa hide-sm" href={wa(t.waHello)} target="_blank" rel="noopener">
              <WhatsAppIcon /> <bdi dir="ltr">{brand.contact.phone}</bdi>
            </a>
          </div>
        </div>
      </header>

      {menu && (
        <div className="sheet-wrap" onClick={() => setMenu(false)}>
          <aside className="sheet" onClick={(e) => e.stopPropagation()} aria-label={t.menu}>
            <div className="sheet-head">
              <img src={brand.logo} alt="" width={90} height={90} />
              <button className="icon" onClick={() => setMenu(false)} aria-label={t.close}>
                <Icon name="x" />
              </button>
            </div>
            <nav className="sheet-links">
              {t.nav.map((n, i) => (
                <a key={n} href={links[i]} onClick={() => setMenu(false)}>
                  {n}
                  <Icon name="arrow" size={18} />
                </a>
              ))}
            </nav>
            <div className="sheet-foot">
              <a className="btn btn-wa" href={wa(t.waHello)} target="_blank" rel="noopener">
                <WhatsAppIcon /> {t.askWa}
              </a>
              <div className="socials">
                {brand.contact.instagram && (
                  <a href={brand.contact.instagram} target="_blank" rel="noopener" aria-label="Instagram">
                    <Icon name="ig" />
                  </a>
                )}
                {brand.contact.facebook && (
                  <a href={brand.contact.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                    <Icon name="fb" />
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="wrap hero-in">
            <img className="hero-mark" src={brand.logo} alt="" aria-hidden="true" />

            <div className="hero-copy">
              <p className="eyebrow reveal">{brand.fullName[lang]}</p>
              <h1 className="reveal">{brand.tagline[lang]}</h1>
              <p className="hero-sub reveal">{brand.about[lang]}</p>
              <div className="hero-actions reveal">
                <a className="btn btn-gold" href="#shop">
                  {t.heroCta} <Icon name="arrow" size={17} />
                </a>
                <a className="btn btn-ghost" href={wa(t.waHello)} target="_blank" rel="noopener">
                  <WhatsAppIcon /> {t.heroAsk}
                </a>
              </div>
              <dl className="stats reveal">
                {brand.stats.map((s) => (
                  <div key={s.label.en}>
                    <dt>{s.label[lang]}</dt>
                    <dd dir="ltr">{s.n}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="hero-art">
              {hero.map((p, i) => (
                <button key={p.id} className={`hshot hshot-${i} reveal`} onClick={() => setOpen(p)} aria-label={p.name[lang]}>
                  <img src={img(p.id, 0, i === 0 ? "l" : "m")} alt={p.name[lang]} />
                  <span>{p.brand}</span>
                </button>
              ))}
              <span className="ring" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Brand strip */}
        <div className="strip" aria-label={t.brandsTitle}>
          <div className="strip-track">
            {[...brand.brands, ...brand.brands, ...brand.brands, ...brand.brands].map((b, i) => (
              <span key={i}>
                {b}
                <i aria-hidden="true">✦</i>
              </span>
            ))}
          </div>
        </div>

        {/* Products */}
        <section className="section" id="shop">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <h2>{t.shopTitle}</h2>
                <p>{t.shopSub}</p>
              </div>
              <span className="count">{t.results(list.length)}</span>
            </div>
            <div className="tabs" role="tablist">
              {tabs.map((c) => (
                <button key={c.key} role="tab" aria-selected={cat === c.key} className={cat === c.key ? "on" : ""} onClick={() => setCat(c.key)}>
                  {c[lang]}
                </button>
              ))}
            </div>
            <div className="grid">
              {list.map((p) => (
                <article key={p.id} className="card reveal">
                  <button className="card-media" onClick={() => setOpen(p)} aria-label={`${t.details}: ${p.name[lang]}`}>
                    <img className="main" src={img(p.id, 0, "m")} alt={p.name[lang]} loading="lazy" />
                    <img className="alt" src={img(p.id, 1, "m")} alt="" loading="lazy" />
                    {p.tag && <em className="tag">{p.tag[lang]}</em>}
                    <span className="shots">{t.photos(p.count)}</span>
                  </button>
                  <div className="card-body">
                    <span className="brandline" dir="ltr">
                      {p.brand}
                    </span>
                    <h3>{p.name[lang]}</h3>
                    <p>{p.blurb[lang]}</p>
                    <div className="card-foot">
                      <button className="link" onClick={() => setOpen(p)}>
                        {t.details} <Icon name="arrow" size={15} />
                      </button>
                      <a className="btn btn-sm btn-gold" href={wa(t.waAsk(`${p.brand} — ${p.name.ar}`))} target="_blank" rel="noopener">
                        {t.ask}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="section why" id="why">
          <div className="wrap">
            <div className="sec-head center reveal">
              <h2>{t.why}</h2>
            </div>
            <div className="perks">
              {brand.highlights.map((h) => (
                <div key={h.title.en} className="perk reveal">
                  <span className="perk-ico">
                    <Icon name={h.icon} size={24} />
                  </span>
                  <h3>{h.title[lang]}</h3>
                  <p>{h.text[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Store */}
        <section className="section" id="store">
          <div className="wrap store">
            <div className="store-copy reveal">
              <h2>{t.storeTitle}</h2>
              <p className="muted">{t.storeSub}</p>
              <dl className="store-list">
                <div>
                  <dt>
                    <Icon name="pin" size={18} /> {t.address}
                  </dt>
                  <dd>{brand.contact.address[lang]}</dd>
                </div>
                <div>
                  <dt>
                    <Icon name="clock" size={18} /> {t.hours}
                  </dt>
                  <dd>{brand.contact.hours[lang]}</dd>
                </div>
                <div>
                  <dt>
                    <Icon name="phone" size={18} /> {t.phone}
                  </dt>
                  <dd>
                    <a href={`tel:${brand.contact.phone}`} dir="ltr">
                      {brand.contact.phone}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="store-actions">
                <a className="btn btn-gold" href={wa(t.waHello)} target="_blank" rel="noopener">
                  <WhatsAppIcon /> {t.askWa}
                </a>
                {brand.contact.map && (
                  <a className="btn btn-line" href={brand.contact.map} target="_blank" rel="noopener">
                    <Icon name="pin" size={17} /> {t.openMap}
                  </a>
                )}
              </div>
            </div>
            <a className="map reveal" href={brand.contact.map} target="_blank" rel="noopener" aria-label={t.openMap}>
              <span className="map-grid" aria-hidden="true" />
              <span className="map-pin">
                <Icon name="pin" size={26} />
              </span>
              <span className="map-label">
                <b>{brand.name[lang]}</b>
                {brand.contact.address[lang]}
              </span>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="wrap">
            <div className="sec-head center reveal">
              <h2>{t.faqTitle}</h2>
            </div>
            <div className="faq">
              {brand.faqs.map((f, k) => (
                <details key={f.q.en} className="faq-item reveal" open={k === 0}>
                  <summary>
                    {f.q[lang]}
                    <Icon name="plus" size={18} />
                  </summary>
                  <p>{f.a[lang]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-in">
          <div>
            <img src={brand.logo} alt={brand.name[lang]} width={150} height={150} />
            <p>{t.footerNote}</p>
          </div>
          <div className="footer-contact">
            <a href={wa(t.waHello)} target="_blank" rel="noopener">
              <WhatsAppIcon size={18} /> <bdi dir="ltr">{brand.contact.phone}</bdi>
            </a>
            <p>
              <Icon name="pin" size={16} /> {brand.contact.address[lang]}
            </p>
            <div className="socials">
              {brand.contact.instagram && (
                <a href={brand.contact.instagram} target="_blank" rel="noopener" aria-label="Instagram">
                  <Icon name="ig" />
                </a>
              )}
              {brand.contact.facebook && (
                <a href={brand.contact.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                  <Icon name="fb" />
                </a>
              )}
            </div>
          </div>
        </div>
        <p className="wrap copy">
          © {new Date().getFullYear()} {brand.name[lang]} · {t.rights}
        </p>
      </footer>

      <a className="fab" href={wa(t.waHello)} target="_blank" rel="noopener" aria-label={t.askWa}>
        <WhatsAppIcon size={26} />
      </a>

      <dialog ref={dialog} className="dialog" onClose={() => setOpen(null)} onClick={(e) => e.target === dialog.current && setOpen(null)}>
        {open && (
          <div className="dialog-in">
            <button className="icon dialog-x" onClick={() => setOpen(null)} aria-label={t.close}>
              <Icon name="x" />
            </button>
            <div className="gallery">
              <div className="g-main">
                <img src={img(open.id, shot, "l")} alt={open.name[lang]} />
                <button className="icon g-nav prev" onClick={() => setShot((shot - 1 + open.count) % open.count)} aria-label="<">
                  <Icon name="prev" size={18} />
                </button>
                <button className="icon g-nav next" onClick={() => setShot((shot + 1) % open.count)} aria-label=">">
                  <Icon name="next" size={18} />
                </button>
              </div>
              <div className="g-thumbs">
                {Array.from({ length: open.count }, (_, i) => (
                  <button key={i} className={i === shot ? "on" : ""} onClick={() => setShot(i)} aria-label={`${i + 1}`}>
                    <img src={img(open.id, i, "m")} alt="" />
                  </button>
                ))}
              </div>
            </div>
            <div className="dialog-body">
              <span className="brandline" dir="ltr">
                {open.brand}
              </span>
              <h2>{open.name[lang]}</h2>
              <p className="muted">{open.blurb[lang]}</p>
              <ul className="points">
                {open.points.map((pt) => (
                  <li key={pt.en}>
                    <Icon name="sparkle" size={16} /> {pt[lang]}
                  </li>
                ))}
              </ul>
              <a className="btn btn-gold btn-block" href={wa(t.waAsk(`${open.brand} — ${open.name.ar}`))} target="_blank" rel="noopener">
                <WhatsAppIcon /> {t.ask}
              </a>
              <p className="fine">{brand.contact.address[lang]}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
