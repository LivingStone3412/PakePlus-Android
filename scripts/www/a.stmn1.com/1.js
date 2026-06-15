// 2026-2：经文展开/卷起（手风琴：每次只展开一个）
// 触发器：<a class="duokan-footnote" href="#noteX">...</a>
// 内容：  <aside epub:type="footnote" id="noteX">...</aside>
(function () {
  "use strict";

  var lastOpenAside = null;

  function isFootnoteAside(el) {
    return (
      el &&
      el.tagName === "ASIDE" &&
      (el.getAttribute("epub:type") === "footnote" ||
        el.getAttribute("epub:type") === "footnote ")
    );
  }

  function closeAside(aside) {
    if (!aside) return;
    aside.classList.remove("is-open");
  }

  function openAside(aside) {
    if (!aside) return;
    if (lastOpenAside && lastOpenAside !== aside) {
      closeAside(lastOpenAside);
    }
    aside.classList.add("is-open");
    lastOpenAside = aside;
  }

  // 初始化：确保默认都卷起（防止页面里手动加了 is-open）
  function collapseAllFootnotes() {
    var asides = document.getElementsByTagName("aside");
    for (var i = 0; i < asides.length; i++) {
      if (isFootnoteAside(asides[i])) closeAside(asides[i]);
    }
    lastOpenAside = null;
  }

  function findClosestFootnoteLink(target) {
    var el = target;
    while (el && el !== document) {
      if (el.tagName === "A" && el.classList && el.classList.contains("duokan-footnote")) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  function onClick(e) {
    var link = findClosestFootnoteLink(e.target);
    if (!link) return;

    var href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;

    var id = href.slice(1);
    if (!id) return;

    var aside = document.getElementById(id);
    if (!isFootnoteAside(aside)) return;

    // 阻止跳转到 #noteX
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // 同一个：再点就卷起；不同：展开新的并卷起旧的
    var willOpen = !aside.classList.contains("is-open");
    if (willOpen) {
      openAside(aside);
    } else {
      closeAside(aside);
      if (lastOpenAside === aside) lastOpenAside = null;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      collapseAllFootnotes();
      document.addEventListener("click", onClick, true);
    });
  } else {
    collapseAllFootnotes();
    document.addEventListener("click", onClick, true);
  }
})();
