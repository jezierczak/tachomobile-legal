(function () {
  "use strict";

  function getPathParts() {
    return window.location.pathname.split("/").filter(Boolean);
  }

  function getGuideContext() {
    var parts = getPathParts();
    var guideIndex = parts.indexOf("guide");
    var language = parts[0] || "en";
    var module = guideIndex >= 0 && parts[guideIndex + 1] ? parts[guideIndex + 1] : "index";
    return { language: language, module: module };
  }

  function getValue(data, key) {
    return key.split(".").reduce(function (value, part) {
      return value == null ? undefined : value[part];
    }, data);
  }

  function setText(element, value) {
    element.textContent = value == null ? "" : String(value);
  }

  function setHtml(element, value) {
    element.innerHTML = value == null ? "" : String(value);
  }

  function populateList(list, values) {
    list.replaceChildren();
    (Array.isArray(values) ? values : []).forEach(function (value) {
      var item = document.createElement("li");
      item.textContent = value;
      list.appendChild(item);
    });
    list.hidden = !Array.isArray(values) || values.length === 0;
  }

  function applyTranslations(data) {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      setText(element, getValue(data, element.dataset.i18n));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      setHtml(element, getValue(data, element.dataset.i18nHtml));
    });
    document.querySelectorAll("[data-i18n-list]").forEach(function (element) {
      populateList(element, getValue(data, element.dataset.i18nList));
    });
    document.querySelectorAll("[data-i18n-href]").forEach(function (element) {
      var href = getValue(data, element.dataset.i18nHref);
      if (href != null) element.setAttribute("href", String(href));
    });
    document.querySelectorAll("[data-i18n-optional]").forEach(function (element) {
      var key = element.dataset.i18n || element.dataset.i18nHtml;
      var value = key ? getValue(data, key) : "";
      element.hidden = value == null || value === "";
    });
    document.documentElement.lang = data.meta && data.meta.htmlLang ? data.meta.htmlLang : getGuideContext().language;
  }

  function setArticleBackLink(context) {
    if (context.module === "index") return;

    var guideUrl = "/" + encodeURIComponent(context.language) + "/guide/";
    document.querySelectorAll("a.back").forEach(function (element) {
      element.setAttribute("href", guideUrl);
    });
  }

  function showError(context, error) {
    var message = document.createElement("p");
    message.className = "guide-error";
    message.setAttribute("role", "alert");
    message.textContent = "Unable to load the guide translation (" + context.language + "/" + context.module + "). Please try again later.";
    var container = document.querySelector(".container") || document.body;
    container.prepend(message);
    console.error("Guide translation error:", error);
  }

  var context = getGuideContext();
  document.documentElement.lang = context.language;
  setArticleBackLink(context);
  function loadJson(language) {
    return fetch("/guide/lang/" + encodeURIComponent(language) + "/" + encodeURIComponent(context.module) + ".json")
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      });
  }

  loadJson(context.language)
    .catch(function (error) {
      if (context.language === "en") throw error;
      console.warn("Missing guide translation for " + context.language + "; using English fallback.");
      return loadJson("en");
    })
    .then(applyTranslations)
    .catch(function (error) { showError(context, error); });
}());
