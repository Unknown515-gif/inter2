import React, { useState, useRef, useCallback, useMemo } from "react";

// ---------------------------------------------------------------------------
// VALUFY — estimation d'objets par la photo.
// Une seule famille de caractères (Fraunces). Trois temps : accueil (1re visite),
// mur d'abonnement (paywall), puis l'app à onglets (Scanner / Historique / Paramètres).
// ---------------------------------------------------------------------------

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap');
`;

const STRINGS = {
  fr: {
    appName: "Valufy",
    eyebrow: "ESTIMATION D'OBJETS",
    onboardingTagline:
      "Scanne un objet, obtiens sa valeur estimée et une petite description en quelques secondes.",
    ctaFree: "Essayer 3 scans gratuits",
    ctaPremium: "Valufy+ à 3,99 €/mois au lieu de 7 €",
    subtitle: "Une photo. Un jugement. Une valeur.",
    tabScan: "Scanner",
    tabHistory: "Historique",
    tabSettings: "Paramètres",
    dropTitle: "Dépose une photo ici",
    dropSub: "ou touche pour photographier ou choisir une image",
    changePhoto: "Changer la photo",
    newObject: "Nouvel objet",
    estimate: "Estimer cet objet",
    scanning: "Examen à la loupe…",
    fieldObject: "Objet",
    fieldCategory: "Catégorie",
    fieldState: "État apparent",
    verdict: "Verdict du cabinet",
    ledgerNo: "Dossier n°",
    historyTitle: "Registre des objets estimés",
    historyEmpty: "Aucun dossier pour l'instant.",
    historyEmptySub: "Ouvre l'onglet Scanner pour estimer ton premier objet.",
    settingsAppearance: "Apparence",
    settingsLight: "Clair",
    settingsDark: "Sombre",
    settingsLanguage: "Langue",
    settingsAbout: "À propos",
    aboutText:
      "Valufy estime la valeur d'un objet à partir d'une simple photo, à titre indicatif seulement.",
    footer: "Estimations générées par IA — à titre indicatif, pas une expertise officielle.",
    errorFile: "Ce fichier n'est pas une image. Choisis une photo (jpg, png…).",
    errorRead: "Impossible de lire cette image.",
    errorAppraisal: "L'expertise a échoué. Réessaie avec une autre photo.",
    // plan / paywall
    settingsPlan: "Abonnement",
    planFreeLabel: "Plan gratuit",
    planPremiumLabel: "Valufy+ actif",
    upgradeCta: "Passer à Valufy+",
    scansLeftOne: "scan gratuit restant",
    scansLeftMany: "scans gratuits restants",
    noScansLeft: "Tu as utilisé tes 3 scans gratuits.",
    paywallBack: "Retour",
    paywallBadge: "VALUFY+",
    paywallBestOffer: "Meilleure offre",
    paywallHeadline: "Estimations sans limites",
    paywallSub:
      "Scanne autant d'objets que tu veux, avec l'historique complet et des estimations plus détaillées.",
    monthly: "Mensuel",
    annual: "Annuel",
    annualBadge: "-43 %",
    perMonth: "/ mois",
    billedOnce: (amount) => `Soit ${amount} facturés en une fois — 2 mois offerts`,
    savings: (amount) => `Tu économises ${amount} par rapport au mensuel`,
    startCta: "Commencer",
    continueFree: "Continuer avec la version gratuite",
    featureCol1: "FONCTIONNALITÉ",
    featureCol2: "GRATUIT",
    featureCol3: "VALUFY+",
    featureScansLabel: "Scans / mois",
    featureScansFree: "3",
    featureScansPremium: "Illimités",
    featureHistoryLabel: "Historique",
    featureHistoryFree: "3 derniers",
    featureHistoryPremium: "Complet",
    featureDetailLabel: "Détail de l'estimation",
    featureDetailFree: "Basique",
    featureDetailPremium: "Approfondi",
  },
  en: {
    appName: "Valufy",
    eyebrow: "OBJECT APPRAISAL",
    onboardingTagline:
      "Scan an object, get its estimated value and a short description in seconds.",
    ctaFree: "Try 3 scans for free",
    ctaPremium: "Valufy+ at €3.99/mo instead of €7",
    subtitle: "One photo. One verdict. One value.",
    tabScan: "Scan",
    tabHistory: "History",
    tabSettings: "Settings",
    dropTitle: "Drop a photo here",
    dropSub: "or tap to take or choose an image",
    changePhoto: "Change photo",
    newObject: "New object",
    estimate: "Appraise this object",
    scanning: "Examining under the loupe…",
    fieldObject: "Object",
    fieldCategory: "Category",
    fieldState: "Apparent condition",
    verdict: "The cabinet's verdict",
    ledgerNo: "File No.",
    historyTitle: "Register of appraised objects",
    historyEmpty: "No file yet.",
    historyEmptySub: "Open the Scan tab to appraise your first object.",
    settingsAppearance: "Appearance",
    settingsLight: "Light",
    settingsDark: "Dark",
    settingsLanguage: "Language",
    settingsAbout: "About",
    aboutText:
      "Valufy estimates the value of an object from a single photo, for guidance only.",
    footer: "AI-generated estimates — for guidance only, not an official appraisal.",
    errorFile: "This file isn't an image. Choose a photo (jpg, png…).",
    errorRead: "Couldn't read this image.",
    errorAppraisal: "The appraisal failed. Try another photo.",
    settingsPlan: "Subscription",
    planFreeLabel: "Free plan",
    planPremiumLabel: "Valufy+ active",
    upgradeCta: "Upgrade to Valufy+",
    scansLeftOne: "free scan left",
    scansLeftMany: "free scans left",
    noScansLeft: "You've used your 3 free scans.",
    paywallBack: "Back",
    paywallBadge: "VALUFY+",
    paywallBestOffer: "Best offer",
    paywallHeadline: "Unlimited appraisals",
    paywallSub:
      "Scan as many objects as you want, with full history and more detailed estimates.",
    monthly: "Monthly",
    annual: "Annual",
    annualBadge: "-43%",
    perMonth: "/ mo",
    billedOnce: (amount) => `Billed as ${amount} once — 2 months free`,
    savings: (amount) => `You save ${amount} vs monthly`,
    startCta: "Get started",
    continueFree: "Continue with the free version",
    featureCol1: "FEATURE",
    featureCol2: "FREE",
    featureCol3: "VALUFY+",
    featureScansLabel: "Scans / month",
    featureScansFree: "3",
    featureScansPremium: "Unlimited",
    featureHistoryLabel: "History",
    featureHistoryFree: "Last 3",
    featureHistoryPremium: "Full",
    featureDetailLabel: "Estimate detail",
    featureDetailFree: "Basic",
    featureDetailPremium: "In-depth",
  },
};

const THEMES = {
  light: {
    bg: "#E7E1D3",
    bgSoft: "#F1ECE0",
    panel: "#FBF8F1",
    ink: "#241F16",
    inkSoft: "#6B6252",
    rule: "rgba(36,31,22,0.16)",
    accent: "#234B49",
    accentSoft: "rgba(35,75,73,0.10)",
    gold: "#A87F35",
    seal: "#7C2B2B",
    sealBg: "#F1E6D2",
    shadow: "0 24px 48px -24px rgba(36,31,22,0.35)",
  },
  dark: {
    bg: "#141C1B",
    bgSoft: "#1B2624",
    panel: "#20302D",
    ink: "#EFE9DC",
    inkSoft: "#93A39B",
    rule: "rgba(239,233,220,0.14)",
    accent: "#6FBFB6",
    accentSoft: "rgba(111,191,182,0.12)",
    gold: "#CBA054",
    seal: "#D97D6B",
    sealBg: "#28211B",
    shadow: "0 24px 48px -24px rgba(0,0,0,0.6)",
  },
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export default function Valufy() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("fr");
  const [stage, setStage] = useState("onboarding"); // onboarding | paywall | app
  const [tab, setTab] = useState("scan");

  const [isPremium, setIsPremium] = useState(false);
  const [freeScansLeft, setFreeScansLeft] = useState(3);
  const [billingCycle, setBillingCycle] = useState("annual");

  const [imageData, setImageData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const counterRef = useRef(1);

  const t = STRINGS[lang];
  const c = THEMES[theme];

  const reset = useCallback(() => {
    setImageData(null);
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const handleFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith("image/")) {
        setErrorMsg(t.errorFile);
        setStatus("error");
        return;
      }
      setErrorMsg("");
      setResult(null);
      try {
        const base64 = await fileToBase64(file);
        const previewUrl = URL.createObjectURL(file);
        setImageData({ base64, mediaType: file.type, previewUrl });
        setStatus("ready");
      } catch (e) {
        setErrorMsg(t.errorRead);
        setStatus("error");
      }
    },
    [t]
  );

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const runAppraisal = async () => {
    if (!imageData) return;
    if (!isPremium && freeScansLeft <= 0) {
      setStage("paywall");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const languageName = lang === "fr" ? "français" : "English";
      const currency = lang === "fr" ? "EUR" : "USD";
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            `Tu es un expert en estimation d'objets d'occasion. Réponds en ${languageName}. ` +
            "On te montre la photo d'un seul objet. Réponds UNIQUEMENT avec un objet JSON valide, " +
            "sans texte avant ni après, sans balises markdown, au format exact : " +
            '{"objet":"nom court de l\'objet","categorie":"catégorie courte","etat":"état apparent en 2-3 mots",' +
            `"prix_min":nombre,"prix_max":nombre,"devise":"${currency}","phrase":"une phrase vivante et concrète qui décrit l'objet et justifie le prix, 20 mots max"}. ` +
            `Les prix sont en ${currency}, réalistes pour un marché de l'occasion, nombres entiers uniquement.`,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: imageData.mediaType,
                    data: imageData.base64,
                  },
                },
                { type: "text", text: "Estime cet objet selon le format demandé." },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const textBlock = (data.content || [])
        .map((b) => (b.type === "text" ? b.text : ""))
        .filter(Boolean)
        .join("\n");
      const cleaned = textBlock.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const ledgerNumber = String(counterRef.current).padStart(3, "0");
      counterRef.current += 1;

      const entry = { ...parsed, ledgerNumber, previewUrl: imageData.previewUrl };
      setResult(entry);
      setHistory((h) => [entry, ...h]);
      setStatus("done");
      if (!isPremium) setFreeScansLeft((n) => Math.max(0, n - 1));
    } catch (e) {
      console.error(e);
      setErrorMsg(t.errorAppraisal);
      setStatus("error");
    }
  };

  const vars = useMemo(
    () => ({
      "--bg": c.bg,
      "--bgSoft": c.bgSoft,
      "--panel": c.panel,
      "--ink": c.ink,
      "--inkSoft": c.inkSoft,
      "--rule": c.rule,
      "--accent": c.accent,
      "--accentSoft": c.accentSoft,
      "--gold": c.gold,
      "--seal": c.seal,
      "--sealBg": c.sealBg,
      "--shadow": c.shadow,
    }),
    [c]
  );

  return (
    <div style={{ ...styles.page, ...vars }}>
      <style>{FONT_IMPORT}</style>
      <style>{GLOBAL_CSS}</style>

      {stage === "onboarding" && (
        <Onboarding
          t={t}
          onFree={() => {
            setStage("app");
            setTab("scan");
          }}
          onPremium={() => setStage("paywall")}
        />
      )}

      {stage === "paywall" && (
        <Paywall
          t={t}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          onSubscribe={() => {
            setIsPremium(true);
            setStage("app");
            setTab("scan");
          }}
          onSkip={() => setStage("app")}
          canGoBack={history.length > 0 || imageData !== null}
          onBack={() => setStage("app")}
        />
      )}

      {stage === "app" && (
        <div style={styles.frame}>
          <header style={styles.header}>
            <div style={styles.headerTopRow}>
              <span style={styles.eyebrow}>{t.eyebrow}</span>
              {!isPremium && (
                <button style={styles.crownBtn} onClick={() => setStage("paywall")}>
                  <CrownIcon /> Valufy+
                </button>
              )}
              {isPremium && <span style={styles.premiumTag}>Valufy+</span>}
            </div>
            <h1 style={styles.title}>{t.appName}</h1>
            <span style={styles.subtitle}>{t.subtitle}</span>
          </header>

          <nav style={styles.tabs}>
            {[
              ["scan", t.tabScan],
              ["history", t.tabHistory],
              ["settings", t.tabSettings],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  ...styles.tabBtn,
                  color: tab === key ? "var(--ink)" : "var(--inkSoft)",
                }}
              >
                {label}
                <span
                  style={{
                    ...styles.tabUnderline,
                    opacity: tab === key ? 1 : 0,
                  }}
                />
              </button>
            ))}
          </nav>

          <main style={styles.main}>
            {tab === "scan" && (
              <ScanTab
                t={t}
                imageData={imageData}
                status={status}
                result={result}
                errorMsg={errorMsg}
                dragActive={dragActive}
                setDragActive={setDragActive}
                onDrop={onDrop}
                onInputChange={onInputChange}
                fileInputRef={fileInputRef}
                runAppraisal={runAppraisal}
                reset={reset}
                counter={counterRef.current}
                isPremium={isPremium}
                freeScansLeft={freeScansLeft}
                onUpgrade={() => setStage("paywall")}
              />
            )}

            {tab === "history" && <HistoryTab t={t} history={history} />}

            {tab === "settings" && (
              <SettingsTab
                t={t}
                theme={theme}
                setTheme={setTheme}
                lang={lang}
                setLang={setLang}
                isPremium={isPremium}
                onUpgrade={() => setStage("paywall")}
              />
            )}
          </main>

          <footer style={styles.footer}>{t.footer}</footer>
        </div>
      )}
    </div>
  );
}

// ------------------------------- ACCUEIL (1re visite) -------------------------------

function Onboarding({ t, onFree, onPremium }) {
  return (
    <div style={styles.onboardWrap}>
      <OnboardingBackground />
      <div style={styles.onboardContent}>
        <span style={styles.onboardEyebrow}>{t.eyebrow}</span>
        <h1 style={styles.onboardTitle}>Valufy</h1>
        <p style={styles.onboardTagline}>{t.onboardingTagline}</p>

        <div style={styles.onboardActions}>
          <button style={styles.primaryBtnLarge} onClick={onFree}>
            {t.ctaFree}
          </button>
          <button style={styles.premiumBtnLarge} onClick={onPremium}>
            <CrownIcon light /> {t.ctaPremium}
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingBackground() {
  // Motif décoratif en ligne : loupe, étiquette, appareil photo, billet —
  // en filigrane, pas de photo externe, pour rester cohérent avec l'identité du site.
  const icons = [
    { Icon: LoupeGlyph, top: "8%", left: "10%", size: 70, rot: -12 },
    { Icon: TagGlyph, top: "16%", left: "72%", size: 60, rot: 10 },
    { Icon: CameraGlyph, top: "62%", left: "6%", size: 64, rot: 8 },
    { Icon: BanknoteGlyph, top: "70%", left: "68%", size: 76, rot: -6 },
    { Icon: LoupeGlyph, top: "40%", left: "85%", size: 46, rot: 20 },
    { Icon: TagGlyph, top: "48%", left: "-4%", size: 50, rot: -18 },
  ];
  return (
    <div style={styles.onboardBg}>
      <div style={styles.onboardGlow} />
      {icons.map((it, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: it.top,
            left: it.left,
            width: it.size,
            height: it.size,
            transform: `rotate(${it.rot}deg)`,
            opacity: 0.16,
          }}
        >
          <it.Icon />
        </div>
      ))}
    </div>
  );
}

function LoupeGlyph() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
      <circle cx="26" cy="26" r="18" stroke="var(--gold)" strokeWidth="3" />
      <line x1="39" y1="39" x2="56" y2="56" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
function TagGlyph() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
      <path
        d="M8 30 30 8h20a6 6 0 0 1 6 6v20L34 56a6 6 0 0 1-8.5 0L8 38.5a6 6 0 0 1 0-8.5Z"
        stroke="var(--gold)"
        strokeWidth="3"
      />
      <circle cx="42" cy="22" r="3.5" fill="var(--gold)" />
    </svg>
  );
}
function CameraGlyph() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
      <path
        d="M12 22h8l4-6h16l4 6h8a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V25a3 3 0 0 1 3-3Z"
        stroke="var(--gold)"
        strokeWidth="3"
      />
      <circle cx="32" cy="35" r="9" stroke="var(--gold)" strokeWidth="3" />
    </svg>
  );
}
function BanknoteGlyph() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
      <rect x="6" y="18" width="52" height="28" rx="3" stroke="var(--gold)" strokeWidth="3" />
      <circle cx="32" cy="32" r="8" stroke="var(--gold)" strokeWidth="3" />
    </svg>
  );
}
function CrownIcon({ light }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: "-2px" }}>
      <path
        d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8Z"
        fill={light ? "#F1E6D2" : "var(--gold)"}
      />
    </svg>
  );
}

// --------------------------------- PAYWALL ---------------------------------

function Paywall({ t, billingCycle, setBillingCycle, onSubscribe, onSkip, onBack, canGoBack }) {
  const monthlyPrice = 7;
  const discountedMonthly = 3.99;
  const annualTotal = (discountedMonthly * 12).toFixed(2).replace(".", ",");
  const savings = ((monthlyPrice - discountedMonthly) * 12).toFixed(2).replace(".", ",");
  const isAnnual = billingCycle === "annual";
  const displayPrice = isAnnual ? "3,99" : "6,99";
  const displayStrike = isAnnual ? "6,90" : null;

  return (
    <div style={styles.paywallWrap}>
      <div style={styles.paywallTopRow}>
        {canGoBack ? (
          <button style={styles.paywallBackBtn} onClick={onBack}>
            ← {t.paywallBack}
          </button>
        ) : (
          <span />
        )}
        <button style={styles.paywallSkip} onClick={onSkip}>
          {t.continueFree}
        </button>
      </div>

      <div style={styles.paywallHero}>
        <span style={styles.paywallPill}>
          <CrownIcon /> {t.paywallBadge}
        </span>
        <h2 style={styles.paywallHeadline}>{t.paywallHeadline}</h2>
        <p style={styles.paywallSub}>{t.paywallSub}</p>
      </div>

      <div style={styles.segmented2}>
        <button
          onClick={() => setBillingCycle("monthly")}
          style={{
            ...styles.segment2Btn,
            ...(billingCycle === "monthly" ? styles.segment2BtnActive : {}),
          }}
        >
          {t.monthly}
        </button>
        <button
          onClick={() => setBillingCycle("annual")}
          style={{
            ...styles.segment2Btn,
            ...(billingCycle === "annual" ? styles.segment2BtnActive : {}),
          }}
        >
          {t.annual}
          <span style={styles.annualBadge}>{t.annualBadge}</span>
        </button>
      </div>

      <div style={styles.priceCard}>
        <div style={styles.priceCardTop}>
          <span style={styles.priceCardBadgeText}>
            <CrownIcon /> {t.paywallBadge}
          </span>
          {isAnnual && <span style={styles.bestOffer}>{t.paywallBestOffer}</span>}
        </div>

        <div style={styles.priceRow}>
          <span style={styles.priceMain}>{displayPrice} €</span>
          <span style={styles.pricePer}>{t.perMonth}</span>
          {displayStrike && <span style={styles.priceStrike}>{displayStrike} €</span>}
        </div>

        {isAnnual && (
          <p style={styles.billedOnceText}>{t.billedOnce(`${annualTotal} €`)}</p>
        )}

        <button style={styles.startCtaBtn} onClick={onSubscribe}>
          ⚡ {t.startCta}
        </button>

        {isAnnual && (
          <p style={styles.savingsText}>{t.savings(`${savings} €`)}</p>
        )}
      </div>

      <div style={styles.featureTable}>
        <div style={styles.featureHeaderRow}>
          <span style={styles.featureHeaderCol}>{t.featureCol1}</span>
          <span style={styles.featureHeaderCol}>{t.featureCol2}</span>
          <span style={{ ...styles.featureHeaderCol, color: "var(--seal)" }}>
            {t.featureCol3}
          </span>
        </div>
        {[
          [t.featureScansLabel, t.featureScansFree, t.featureScansPremium],
          [t.featureHistoryLabel, t.featureHistoryFree, t.featureHistoryPremium],
          [t.featureDetailLabel, t.featureDetailFree, t.featureDetailPremium],
        ].map((row, i) => (
          <div style={styles.featureRow} key={i}>
            <span style={styles.featureCell}>{row[0]}</span>
            <span style={{ ...styles.featureCell, color: "var(--inkSoft)" }}>{row[1]}</span>
            <span style={{ ...styles.featureCell, fontWeight: 600 }}>{row[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------------------------- ONGLET SCAN ---------------------------------

function ScanTab({
  t,
  imageData,
  status,
  result,
  errorMsg,
  dragActive,
  setDragActive,
  onDrop,
  onInputChange,
  fileInputRef,
  runAppraisal,
  reset,
  counter,
  isPremium,
  freeScansLeft,
  onUpgrade,
}) {
  const blocked = !isPremium && freeScansLeft <= 0;
  return (
    <div style={styles.card}>
      <div style={styles.cardTopRow}>
        <span style={styles.cardLabel}>{t.ledgerNo}</span>
        <span style={styles.cardLabelValue}>
          {String(counter).padStart(3, "0")}
        </span>
      </div>

      {!isPremium && (
        <p style={styles.scansLeftText}>
          {freeScansLeft > 0
            ? `${freeScansLeft} ${freeScansLeft === 1 ? t.scansLeftOne : t.scansLeftMany}`
            : t.noScansLeft}
        </p>
      )}

      {!imageData && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          style={{
            ...styles.dropZone,
            borderColor: dragActive ? "var(--seal)" : "var(--gold)",
            background: dragActive ? "var(--accentSoft)" : "transparent",
          }}
        >
          <LoupeIcon />
          <span style={styles.dropTitle}>{t.dropTitle}</span>
          <span style={styles.dropSub}>{t.dropSub}</span>
        </div>
      )}

      {imageData && (
        <div style={styles.photoArea}>
          <img src={imageData.previewUrl} alt="" style={styles.photo} />
          {status === "loading" && (
            <div style={styles.scanOverlay}>
              <LoupeSweep />
              <span style={styles.scanText}>{t.scanning}</span>
            </div>
          )}
          {status === "done" && result && <Seal result={result} />}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onInputChange}
        style={{ display: "none" }}
      />

      {imageData && status !== "loading" && (
        <div style={styles.actionsRow}>
          {status !== "done" &&
            (blocked ? (
              <button style={styles.primaryBtn} onClick={onUpgrade}>
                {t.upgradeCta}
              </button>
            ) : (
              <button style={styles.primaryBtn} onClick={runAppraisal}>
                {t.estimate}
              </button>
            ))}
          <button style={styles.ghostBtn} onClick={reset}>
            {status === "done" ? t.newObject : t.changePhoto}
          </button>
        </div>
      )}

      {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

      {status === "done" && result && (
        <div style={styles.resultStrip}>
          <span style={styles.verdictLabel}>{t.verdict}</span>
          <div style={styles.resultRow}>
            <span style={styles.resultLabel}>{t.fieldObject}</span>
            <span style={styles.resultValue}>{result.objet}</span>
          </div>
          <div style={styles.resultRow}>
            <span style={styles.resultLabel}>{t.fieldCategory}</span>
            <span style={styles.resultValue}>{result.categorie}</span>
          </div>
          <div style={styles.resultRow}>
            <span style={styles.resultLabel}>{t.fieldState}</span>
            <span style={styles.resultValue}>{result.etat}</span>
          </div>
          <p style={styles.phrase}>« {result.phrase} »</p>
        </div>
      )}
    </div>
  );
}

function LoupeIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <circle cx="18" cy="18" r="11" stroke="var(--gold)" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="6.5" fill="var(--accentSoft)" />
      <line x1="26.2" y1="26.2" x2="34" y2="34" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function LoupeSweep() {
  return (
    <div style={styles.loupeSweepTrack}>
      <div style={styles.loupeSweep}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="26" cy="26" r="18" fill="rgba(255,255,255,0.06)" stroke="var(--gold)" strokeWidth="2.4" />
          <line x1="39" y1="39" x2="55" y2="55" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function Seal({ result }) {
  return (
    <div style={styles.sealWrap}>
      <div style={styles.seal}>
        <span style={styles.sealRing}>{result.categorie}</span>
        <span style={styles.sealPrice}>
          {result.prix_min}–{result.prix_max}
        </span>
        <span style={styles.sealCurrency}>{result.devise}</span>
      </div>
    </div>
  );
}

// ------------------------------- ONGLET HISTORIQUE -------------------------------

function HistoryTab({ t, history }) {
  if (history.length === 0) {
    return (
      <div style={styles.emptyState}>
        <span style={styles.emptyTitle}>{t.historyEmpty}</span>
        <span style={styles.emptySub}>{t.historyEmptySub}</span>
      </div>
    );
  }
  return (
    <div style={styles.card}>
      <span style={styles.sectionTitle}>{t.historyTitle}</span>
      <div style={styles.ledgerList}>
        {history.map((h) => (
          <div key={h.ledgerNumber} style={styles.ledgerRow}>
            <img src={h.previewUrl} alt={h.objet} style={styles.ledgerThumb} />
            <div style={styles.ledgerInfo}>
              <span style={styles.ledgerObjet}>{h.objet}</span>
              <span style={styles.ledgerMeta}>
                {t.ledgerNo} {h.ledgerNumber} · {h.categorie}
              </span>
            </div>
            <span style={styles.ledgerPrice}>
              {h.prix_min}–{h.prix_max} {h.devise}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------- ONGLET PARAMÈTRES -------------------------------

function SettingsTab({ t, theme, setTheme, lang, setLang, isPremium, onUpgrade }) {
  return (
    <div style={styles.card}>
      <div style={styles.settingsBlock}>
        <span style={styles.sectionTitle}>{t.settingsPlan}</span>
        <div style={styles.planRow}>
          <span style={isPremium ? styles.planPremiumText : styles.planFreeText}>
            {isPremium ? `👑 ${t.planPremiumLabel}` : t.planFreeLabel}
          </span>
          {!isPremium && (
            <button style={styles.upgradeSmallBtn} onClick={onUpgrade}>
              {t.upgradeCta}
            </button>
          )}
        </div>
      </div>

      <div style={styles.settingsBlock}>
        <span style={styles.sectionTitle}>{t.settingsAppearance}</span>
        <div style={styles.segmented}>
          <button
            onClick={() => setTheme("light")}
            style={{ ...styles.segmentBtn, ...(theme === "light" ? styles.segmentBtnActive : {}) }}
          >
            {t.settingsLight}
          </button>
          <button
            onClick={() => setTheme("dark")}
            style={{ ...styles.segmentBtn, ...(theme === "dark" ? styles.segmentBtnActive : {}) }}
          >
            {t.settingsDark}
          </button>
        </div>
      </div>

      <div style={styles.settingsBlock}>
        <span style={styles.sectionTitle}>{t.settingsLanguage}</span>
        <div style={styles.segmented}>
          <button
            onClick={() => setLang("fr")}
            style={{ ...styles.segmentBtn, ...(lang === "fr" ? styles.segmentBtnActive : {}) }}
          >
            Français
          </button>
          <button
            onClick={() => setLang("en")}
            style={{ ...styles.segmentBtn, ...(lang === "en" ? styles.segmentBtnActive : {}) }}
          >
            English
          </button>
        </div>
      </div>

      <div style={styles.settingsBlock}>
        <span style={styles.sectionTitle}>{t.settingsAbout}</span>
        <p style={styles.aboutText}>{t.aboutText}</p>
      </div>
    </div>
  );
}

// ------------------------------------- CSS -------------------------------------

const GLOBAL_CSS = `
@keyframes sealDrop {
  0%   { transform: translate(-50%,-50%) rotate(-16deg) scale(2.2); opacity: 0; }
  55%  { transform: translate(-50%,-50%) rotate(-7deg) scale(0.95); opacity: 1; }
  75%  { transform: translate(-50%,-50%) rotate(-9deg) scale(1.04); }
  100% { transform: translate(-50%,-50%) rotate(-8deg) scale(1); }
}
@keyframes loupeMove {
  0%   { top: 8%; left: 6%; }
  25%  { top: 60%; left: 55%; }
  50%  { top: 20%; left: 70%; }
  75%  { top: 65%; left: 15%; }
  100% { top: 8%; left: 6%; }
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.06); }
}
* { box-sizing: border-box; }
::selection { background: var(--accent); color: var(--panel); }
button:focus-visible, div[tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; }
}
`;

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--ink)",
    fontFamily: "'Fraunces', serif",
    display: "flex",
    justifyContent: "center",
    padding: "0",
    transition: "background 0.25s ease, color 0.25s ease",
  },
  frame: {
    width: "100%",
    maxWidth: 460,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "36px 16px 24px",
  },

  // -------- onboarding --------
  onboardWrap: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "24px 20px",
  },
  onboardBg: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },
  onboardGlow: {
    position: "absolute",
    top: "-10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "radial-gradient(circle, var(--accentSoft) 0%, transparent 70%)",
    animation: "glowPulse 6s ease-in-out infinite",
  },
  onboardContent: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: "var(--panel)",
    border: "1px solid var(--rule)",
    borderRadius: 16,
    padding: "44px 26px 32px",
    boxShadow: "var(--shadow)",
  },
  onboardEyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.24em",
    color: "var(--gold)",
    marginBottom: 12,
  },
  onboardTitle: {
    fontWeight: 600,
    fontSize: "clamp(38px, 9vw, 56px)",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  onboardTagline: {
    marginTop: 14,
    fontSize: 15,
    fontStyle: "italic",
    color: "var(--inkSoft)",
    lineHeight: 1.55,
    maxWidth: 320,
  },
  onboardActions: {
    marginTop: 30,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  primaryBtnLarge: {
    background: "var(--ink)",
    color: "var(--panel)",
    border: "none",
    borderRadius: 8,
    padding: "16px 18px",
    fontFamily: "'Fraunces', serif",
    fontSize: 15.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  premiumBtnLarge: {
    background: "var(--sealBg)",
    color: "var(--seal)",
    border: "1.4px solid var(--seal)",
    borderRadius: 8,
    padding: "16px 18px",
    fontFamily: "'Fraunces', serif",
    fontSize: 14.5,
    fontWeight: 600,
    fontStyle: "italic",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // -------- paywall --------
  paywallWrap: {
    width: "100%",
    maxWidth: 460,
    padding: "20px 18px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  paywallTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paywallBackBtn: {
    background: "none",
    border: "none",
    color: "var(--inkSoft)",
    fontFamily: "'Fraunces', serif",
    fontSize: 13.5,
    cursor: "pointer",
  },
  paywallSkip: {
    background: "none",
    border: "none",
    color: "var(--inkSoft)",
    fontFamily: "'Fraunces', serif",
    fontSize: 12.5,
    fontStyle: "italic",
    textDecoration: "underline",
    cursor: "pointer",
  },
  paywallHero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  paywallPill: {
    display: "inline-flex",
    alignItems: "center",
    background: "var(--sealBg)",
    color: "var(--seal)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 11.5,
    fontWeight: 600,
    letterSpacing: "0.06em",
  },
  paywallHeadline: {
    fontSize: "clamp(24px, 6vw, 30px)",
    fontWeight: 600,
    margin: "6px 0 0",
  },
  paywallSub: {
    fontSize: 13.5,
    fontStyle: "italic",
    color: "var(--inkSoft)",
    maxWidth: 340,
    lineHeight: 1.5,
  },
  segmented2: {
    display: "flex",
    background: "var(--bgSoft)",
    borderRadius: 24,
    padding: 4,
    gap: 4,
  },
  segment2Btn: {
    flex: 1,
    background: "transparent",
    border: "none",
    borderRadius: 20,
    padding: "10px 12px",
    fontFamily: "'Fraunces', serif",
    fontSize: 13.5,
    color: "var(--inkSoft)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  segment2BtnActive: {
    background: "var(--panel)",
    color: "var(--ink)",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  },
  annualBadge: {
    background: "var(--gold)",
    color: "var(--panel)",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: "2px 6px",
  },
  priceCard: {
    background: "var(--sealBg)",
    border: "1.4px solid var(--seal)",
    borderRadius: 14,
    padding: "20px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  priceCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceCardBadgeText: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--seal)",
    display: "flex",
    alignItems: "center",
  },
  bestOffer: {
    background: "var(--seal)",
    color: "var(--sealBg)",
    fontSize: 10.5,
    fontWeight: 700,
    borderRadius: 20,
    padding: "4px 10px",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    marginTop: 6,
  },
  priceMain: {
    fontSize: 36,
    fontWeight: 700,
    color: "var(--seal)",
  },
  pricePer: {
    fontSize: 13,
    color: "var(--inkSoft)",
  },
  priceStrike: {
    fontSize: 14,
    color: "var(--inkSoft)",
    textDecoration: "line-through",
    marginLeft: 4,
  },
  billedOnceText: {
    fontSize: 12.5,
    color: "var(--inkSoft)",
    fontStyle: "italic",
    margin: "2px 0 8px",
  },
  startCtaBtn: {
    background: "var(--seal)",
    color: "var(--sealBg)",
    border: "none",
    borderRadius: 30,
    padding: "14px 16px",
    fontFamily: "'Fraunces', serif",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
  },
  savingsText: {
    textAlign: "center",
    fontSize: 12,
    color: "var(--accent)",
    fontStyle: "italic",
    marginTop: 8,
  },
  featureTable: {
    background: "var(--panel)",
    border: "1px solid var(--rule)",
    borderRadius: 10,
    overflow: "hidden",
  },
  featureHeaderRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.8fr 0.8fr",
    padding: "10px 14px",
    borderBottom: "1px solid var(--rule)",
  },
  featureHeaderCol: {
    fontSize: 10,
    letterSpacing: "0.08em",
    color: "var(--inkSoft)",
    fontWeight: 600,
  },
  featureRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.8fr 0.8fr",
    padding: "12px 14px",
    borderBottom: "1px solid var(--rule)",
  },
  featureCell: {
    fontSize: 13,
  },

  // -------- app shell (shared) --------
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 26,
    textAlign: "center",
    width: "100%",
  },
  headerTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
    position: "relative",
    width: "100%",
  },
  crownBtn: {
    position: "absolute",
    right: 0,
    background: "var(--sealBg)",
    color: "var(--seal)",
    border: "1px solid var(--seal)",
    borderRadius: 20,
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  premiumTag: {
    position: "absolute",
    right: 0,
    fontSize: 11,
    fontWeight: 700,
    color: "var(--seal)",
    letterSpacing: "0.04em",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.22em",
    color: "var(--gold)",
  },
  title: {
    fontWeight: 600,
    fontStyle: "normal",
    fontSize: "clamp(34px, 7vw, 54px)",
    margin: 0,
    letterSpacing: "-0.015em",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: 400,
    color: "var(--inkSoft)",
  },
  tabs: {
    display: "flex",
    gap: 26,
    marginBottom: 22,
    borderBottom: "1px solid var(--rule)",
    width: "100%",
    justifyContent: "center",
  },
  tabBtn: {
    position: "relative",
    background: "none",
    border: "none",
    padding: "0 2px 12px",
    fontFamily: "'Fraunces', serif",
    fontSize: 15.5,
    fontWeight: 500,
    letterSpacing: "0.01em",
    cursor: "pointer",
  },
  tabUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -1,
    height: 2,
    background: "var(--seal)",
    borderRadius: 2,
    transition: "opacity 0.2s ease",
  },
  main: { width: "100%" },
  card: {
    background: "var(--panel)",
    borderRadius: 8,
    padding: "24px 22px",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--rule)",
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottom: "1px dashed var(--rule)",
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: "0.14em",
    color: "var(--inkSoft)",
  },
  cardLabelValue: {
    fontSize: 14,
    fontWeight: 600,
    fontStyle: "italic",
    color: "var(--seal)",
  },
  scansLeftText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "var(--inkSoft)",
    margin: "0 0 14px",
  },
  dropZone: {
    border: "1.6px dashed",
    borderRadius: 6,
    padding: "50px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
  },
  dropTitle: {
    fontSize: 19,
    fontWeight: 500,
  },
  dropSub: {
    fontSize: 12.5,
    fontStyle: "italic",
    color: "var(--inkSoft)",
    textAlign: "center",
  },
  photoArea: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: 5,
    overflow: "hidden",
    background: "var(--bgSoft)",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  scanOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.28)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 14,
    overflow: "hidden",
  },
  loupeSweepTrack: { position: "absolute", inset: 0 },
  loupeSweep: {
    position: "absolute",
    animation: "loupeMove 3.2s ease-in-out infinite",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
  },
  scanText: {
    fontSize: 12.5,
    fontStyle: "italic",
    color: "#fff",
    background: "rgba(0,0,0,0.45)",
    padding: "5px 12px",
    borderRadius: 20,
    position: "relative",
    zIndex: 2,
  },
  sealWrap: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  seal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%) rotate(-8deg)",
    animation: "sealDrop 0.55s cubic-bezier(.2,.8,.3,1.1) forwards",
    width: 132,
    height: 132,
    borderRadius: "50%",
    border: "3px double var(--seal)",
    background: "var(--sealBg)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
  },
  sealRing: {
    position: "absolute",
    top: 8,
    fontSize: 8.5,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--seal)",
    fontWeight: 600,
  },
  sealPrice: {
    fontSize: 22,
    fontWeight: 600,
    fontStyle: "italic",
    color: "var(--seal)",
    lineHeight: 1.1,
  },
  sealCurrency: {
    fontSize: 10.5,
    letterSpacing: "0.1em",
    color: "var(--seal)",
    marginTop: 2,
  },
  actionsRow: {
    display: "flex",
    gap: 10,
    marginTop: 18,
  },
  primaryBtn: {
    flex: 1,
    background: "var(--ink)",
    color: "var(--panel)",
    border: "none",
    borderRadius: 5,
    padding: "13px 16px",
    fontFamily: "'Fraunces', serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    color: "var(--inkSoft)",
    border: "1px solid var(--gold)",
    borderRadius: 5,
    padding: "13px 16px",
    fontFamily: "'Fraunces', serif",
    fontSize: 14,
    fontStyle: "italic",
    cursor: "pointer",
  },
  errorText: {
    marginTop: 14,
    fontSize: 13.5,
    fontStyle: "italic",
    color: "var(--seal)",
  },
  resultStrip: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px dashed var(--rule)",
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  verdictLabel: {
    fontSize: 11,
    letterSpacing: "0.14em",
    color: "var(--gold)",
    marginBottom: 4,
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13.5,
  },
  resultLabel: {
    color: "var(--inkSoft)",
  },
  resultValue: {
    fontWeight: 600,
    textTransform: "capitalize",
  },
  phrase: {
    marginTop: 10,
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: 16.5,
    lineHeight: 1.5,
  },
  sectionTitle: {
    display: "block",
    fontSize: 12,
    letterSpacing: "0.14em",
    color: "var(--gold)",
    marginBottom: 14,
    textTransform: "uppercase",
  },
  ledgerList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  ledgerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "var(--bgSoft)",
    border: "1px solid var(--rule)",
    borderRadius: 5,
    padding: "9px 11px",
  },
  ledgerThumb: {
    width: 42,
    height: 42,
    objectFit: "cover",
    borderRadius: 4,
    flexShrink: 0,
  },
  ledgerInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  ledgerObjet: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: "capitalize",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  ledgerMeta: {
    fontSize: 11.5,
    fontStyle: "italic",
    color: "var(--inkSoft)",
  },
  ledgerPrice: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--seal)",
    whiteSpace: "nowrap",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "60px 20px",
    border: "1px dashed var(--rule)",
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13.5,
    fontStyle: "italic",
    color: "var(--inkSoft)",
  },
  settingsBlock: {
    marginBottom: 26,
  },
  planRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planFreeText: {
    fontSize: 14.5,
    color: "var(--inkSoft)",
  },
  planPremiumText: {
    fontSize: 14.5,
    fontWeight: 600,
    color: "var(--seal)",
  },
  upgradeSmallBtn: {
    background: "var(--seal)",
    color: "var(--sealBg)",
    border: "none",
    borderRadius: 20,
    padding: "8px 14px",
    fontFamily: "'Fraunces', serif",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  segmented: {
    display: "flex",
    border: "1px solid var(--rule)",
    borderRadius: 6,
    overflow: "hidden",
    width: "fit-content",
  },
  segmentBtn: {
    background: "transparent",
    color: "var(--inkSoft)",
    border: "none",
    padding: "10px 18px",
    fontFamily: "'Fraunces', serif",
    fontSize: 13.5,
    cursor: "pointer",
  },
  segmentBtnActive: {
    background: "var(--ink)",
    color: "var(--panel)",
  },
  aboutText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "var(--inkSoft)",
    lineHeight: 1.6,
    maxWidth: 360,
  },
  footer: {
    marginTop: 30,
    fontSize: 10.5,
    fontStyle: "italic",
    color: "var(--inkSoft)",
    textAlign: "center",
    maxWidth: 400,
  },
};
