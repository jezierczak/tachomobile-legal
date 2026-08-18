(function () {
  "use strict";

  // Paste the real GA4 Measurement ID here when it is available.
  var TACHOMOBILE_GA4_MEASUREMENT_ID = "G-2RYM96ZJMR";
  var measurementId = TACHOMOBILE_GA4_MEASUREMENT_ID.trim();

  if (!/^G-[A-Za-z0-9]+$/.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);
}());
