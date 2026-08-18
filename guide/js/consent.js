(function () {
  "use strict";

  var STORAGE_KEY = "tachomobile_ga4_consent_v1";
  var CONSENT_GRANTED = "granted";
  var CONSENT_DENIED = "denied";
  var consentState = {
    analytics_storage: CONSENT_DENIED,
    ad_storage: CONSENT_DENIED,
    ad_user_data: CONSENT_DENIED,
    ad_personalization: CONSENT_DENIED
  };

  var translations = {
    cz: { title: "Souhlas s analytikou", text: "Tento web používá Google Analytics 4 k měření návštěvnosti a zlepšování obsahu. Analytické soubory cookie použijeme pouze s vaším souhlasem.", accept: "Souhlasím", reject: "Odmítám", settings: "Nastavení soukromí" },
    de: { title: "Zustimmung zur Analyse", text: "Diese Website verwendet Google Analytics 4, um Besuche zu messen und Inhalte zu verbessern. Analyse-Cookies werden nur mit Ihrer Zustimmung verwendet.", accept: "Akzeptieren", reject: "Ablehnen", settings: "Datenschutzeinstellungen" },
    en: { title: "Analytics consent", text: "This website uses Google Analytics 4 to measure visits and improve its content. Analytics cookies are used only with your consent.", accept: "Accept", reject: "Reject", settings: "Privacy settings" },
    es: { title: "Consentimiento para analítica", text: "Este sitio utiliza Google Analytics 4 para medir las visitas y mejorar su contenido. Las cookies analíticas solo se utilizan con su consentimiento.", accept: "Aceptar", reject: "Rechazar", settings: "Configuración de privacidad" },
    fr: { title: "Consentement aux statistiques", text: "Ce site utilise Google Analytics 4 pour mesurer les visites et améliorer son contenu. Les cookies analytiques ne sont utilisés qu'avec votre consentement.", accept: "Accepter", reject: "Refuser", settings: "Paramètres de confidentialité" },
    hu: { title: "Hozzájárulás az elemzéshez", text: "Ez a webhely a Google Analytics 4 segítségével méri a látogatásokat és javítja a tartalmat. Az analitikai sütiket csak az Ön hozzájárulásával használjuk.", accept: "Elfogadom", reject: "Elutasítom", settings: "Adatvédelmi beállítások" },
    it: { title: "Consenso per le statistiche", text: "Questo sito utilizza Google Analytics 4 per misurare le visite e migliorare i contenuti. I cookie analitici vengono utilizzati solo con il tuo consenso.", accept: "Accetto", reject: "Rifiuto", settings: "Impostazioni privacy" },
    lt: { title: "Sutikimas dėl analitikos", text: "Šioje svetainėje naudojama „Google Analytics 4“, kad būtų matuojami apsilankymai ir gerinamas turinys. Analitiniai slapukai naudojami tik gavus jūsų sutikimą.", accept: "Sutinku", reject: "Nesutinku", settings: "Privatumo nustatymai" },
    pl: { title: "Zgoda na analitykę", text: "Ta strona korzysta z Google Analytics 4 do pomiaru odwiedzin i ulepszania treści. Pliki analityczne są używane wyłącznie za Twoją zgodą.", accept: "Akceptuję", reject: "Odrzucam", settings: "Ustawienia prywatności" },
    pt: { title: "Consentimento para análise", text: "Este site utiliza o Google Analytics 4 para medir visitas e melhorar o conteúdo. Os cookies analíticos só são utilizados com o seu consentimento.", accept: "Aceito", reject: "Rejeito", settings: "Definições de privacidade" },
    ro: { title: "Consimțământ pentru analiză", text: "Acest site folosește Google Analytics 4 pentru a măsura vizitele și a îmbunătăți conținutul. Cookie-urile de analiză sunt utilizate numai cu acordul dumneavoastră.", accept: "Accept", reject: "Respind", settings: "Setări de confidențialitate" },
    ru: { title: "Согласие на аналитику", text: "Этот сайт использует Google Analytics 4 для измерения посещаемости и улучшения содержания. Аналитические файлы cookie используются только с вашего согласия.", accept: "Принимаю", reject: "Отклоняю", settings: "Настройки конфиденциальности" },
    sk: { title: "Súhlas s analytikou", text: "Táto stránka používa Google Analytics 4 na meranie návštevnosti a zlepšovanie obsahu. Analytické súbory cookie používame iba s vaším súhlasom.", accept: "Súhlasím", reject: "Odmietam", settings: "Nastavenia súkromia" },
    tr: { title: "Analiz izni", text: "Bu web sitesi ziyaretleri ölçmek ve içeriğini geliştirmek için Google Analytics 4 kullanır. Analiz çerezleri yalnızca izninizle kullanılır.", accept: "Kabul ediyorum", reject: "Reddediyorum", settings: "Gizlilik ayarları" },
    ua: { title: "Згода на аналітику", text: "Цей сайт використовує Google Analytics 4 для вимірювання відвідувань і покращення вмісту. Аналітичні файли cookie використовуються лише за вашою згодою.", accept: "Приймаю", reject: "Відхиляю", settings: "Налаштування приватності" }
  };

  function getLanguage() {
    var pathLanguage = window.location.pathname.split("/").filter(Boolean)[0];
    if (translations[pathLanguage]) return pathLanguage;
    var browserLanguage = (navigator.language || "en").toLowerCase().split("-")[0];
    if (browserLanguage === "cs") browserLanguage = "cz";
    return translations[browserLanguage] ? browserLanguage : "en";
  }

  function updateConsent(value) {
    var state = value === "accepted" ? CONSENT_GRANTED : CONSENT_DENIED;
    consentState.analytics_storage = state;
    consentState.ad_storage = state;
    consentState.ad_user_data = state;
    consentState.ad_personalization = state;
    if (window.gtag) window.gtag("consent", "update", consentState);
  }

  function saveDecision(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (error) { /* Storage may be disabled. */ }
  }

  function getDecision() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (error) { return null; }
  }

  function addStyles() {
    var style = document.createElement("style");
    style.textContent = [
      ".tm-consent-banner{position:fixed;z-index:2147483647;left:16px;right:16px;bottom:16px;max-width:720px;margin:0 auto;padding:18px 20px;border:1px solid rgba(124,58,237,.35);border-radius:12px;background:#14151f;color:#fff;box-shadow:0 8px 30px rgba(0,0,0,.35);font-family:Arial,sans-serif;line-height:1.5}",
      ".tm-consent-banner h2{margin:0 0 8px;font-size:18px;color:#fff}",
      ".tm-consent-banner p{margin:0 0 14px;color:#e5e7eb;font-size:14px}",
      ".tm-consent-actions{display:flex;flex-wrap:wrap;gap:8px}",
      ".tm-consent-actions button,.tm-consent-settings{border:0;border-radius:7px;padding:9px 14px;font:inherit;font-size:14px;cursor:pointer}",
      ".tm-consent-accept{background:#7c3aed;color:#fff}",
      ".tm-consent-reject{background:#2b2d3a;color:#fff}",
      ".tm-consent-settings{position:fixed;z-index:2147483646;right:14px;bottom:12px;padding:5px 8px;background:rgba(20,21,31,.86);color:#d8b4fe;font-size:11px;cursor:pointer}",
      "@media(max-width:600px){.tm-consent-banner{left:10px;right:10px;bottom:10px;padding:15px}.tm-consent-actions button{flex:1 1 auto}.tm-consent-settings{right:8px;bottom:6px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function showBanner() {
    var language = getLanguage();
    var copy = translations[language];
    var existing = document.querySelector(".tm-consent-banner");
    if (existing) existing.remove();

    var banner = document.createElement("section");
    banner.className = "tm-consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "tm-consent-title");
    banner.innerHTML = "<h2 id=\"tm-consent-title\"></h2><p></p><div class=\"tm-consent-actions\"><button type=\"button\" class=\"tm-consent-accept\"></button><button type=\"button\" class=\"tm-consent-reject\"></button></div>";
    banner.querySelector("h2").textContent = copy.title;
    banner.querySelector("p").textContent = copy.text;
    banner.querySelector(".tm-consent-accept").textContent = copy.accept;
    banner.querySelector(".tm-consent-reject").textContent = copy.reject;
    banner.querySelector(".tm-consent-accept").addEventListener("click", function () { saveDecision("accepted"); updateConsent("accepted"); banner.remove(); });
    banner.querySelector(".tm-consent-reject").addEventListener("click", function () { saveDecision("rejected"); updateConsent("rejected"); banner.remove(); });
    document.body.appendChild(banner);
  }

  function addSettingsLink() {
    var copy = translations[getLanguage()];
    var link = document.createElement("button");
    link.type = "button";
    link.className = "tm-consent-settings";
    link.textContent = copy.settings;
    link.addEventListener("click", showBanner);
    document.body.appendChild(link);
  }

  // This runs before analytics.js because both scripts are deferred and consent.js is included first.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: CONSENT_DENIED,
    ad_storage: CONSENT_DENIED,
    ad_user_data: CONSENT_DENIED,
    ad_personalization: CONSENT_DENIED,
    wait_for_update: 500
  });

  var savedDecision = getDecision();
  if (savedDecision === "accepted" || savedDecision === "rejected") updateConsent(savedDecision);

  addStyles();
  if (document.body) {
    addSettingsLink();
    if (!savedDecision) showBanner();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      addSettingsLink();
      if (!savedDecision) showBanner();
    });
  }
}());
