/*
 * Renders fun/aitimeline/events.json as a vertical timeline, sorted by date.
 * To add an event, edit events.json and add screenshots under images/. See README.md.
 * dateNote, imageNote, note, and sources[].note are tooltips.
 * Clicking a thumbnail opens imageFull.
 */
(function () {
  var list = document.getElementById("timeline");
  var countEl = document.getElementById("count");
  var pop = document.getElementById("tip");
  var current = null;
  var pinned = false;

  function setMessage(text, isError) {
    list.classList.add("is-message");
    list.replaceChildren();
    var item = document.createElement("li");
    item.className = isError ? "status error" : "status";
    item.textContent = text;
    list.appendChild(item);
  }

  function isIsoDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var parts = value.split("-");
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    var utc = new Date(Date.UTC(year, month - 1, day));
    return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
  }

  function formatDate(iso) {
    var parts = iso.split("-");
    var utc = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(utc);
  }

  function safeHttpUrl(url) {
    try {
      var parsed = new URL(url);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
    } catch (error) {
      return "";
    }
    return "";
  }

  function safeImage(path) {
    if (typeof path !== "string") return "";
    if (!/^images\/[A-Za-z0-9][A-Za-z0-9._-]*\.(webp|jpe?g|png)$/i.test(path)) return "";
    return path;
  }

  function noteText(value) {
    return typeof value === "string" && value.trim() ? value.trim() : "";
  }

  function hideTip() {
    if (current) {
      current.removeAttribute("aria-describedby");
      if (current.hasAttribute("aria-expanded")) current.setAttribute("aria-expanded", "false");
    }
    current = null;
    pinned = false;
    pop.hidden = true;
    pop.textContent = "";
  }

  function placeTip(el) {
    var rect = el.getBoundingClientRect();
    var width = pop.offsetWidth;
    var height = pop.offsetHeight;
    var left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    var top = rect.top - height - 6;
    if (top < 8) top = rect.bottom + 6;
    if (top + height > window.innerHeight - 8) top = Math.max(8, window.innerHeight - height - 8);
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }

  function showTip(el, pin) {
    var text = el.getAttribute("data-tip");
    if (!text) return;
    if (current && current !== el) {
      current.removeAttribute("aria-describedby");
      if (current.hasAttribute("aria-expanded")) current.setAttribute("aria-expanded", "false");
    }
    current = el;
    pinned = !!pin;
    pop.textContent = text;
    pop.hidden = false;
    el.setAttribute("aria-describedby", "tip");
    if (el.hasAttribute("aria-expanded")) el.setAttribute("aria-expanded", pinned ? "true" : "false");
    placeTip(el);
  }

  function bindTip(el, opts) {
    opts = opts || {};
    if (!el.getAttribute("data-tip")) return;
    el.addEventListener("pointerenter", function () {
      if (!pinned) showTip(el, false);
    });
    el.addEventListener("pointerleave", function () {
      if (!pinned) hideTip();
    });
    el.addEventListener("focus", function () {
      if (!pinned) showTip(el, false);
    });
    el.addEventListener("blur", function () {
      if (!pinned) hideTip();
    });
    if (opts.click === false) return;
    el.addEventListener("pointerdown", function (event) {
      el.dataset.pointer = event.pointerType || "";
    });
    el.addEventListener("click", function (event) {
      var touch = el.dataset.pointer === "touch";
      var isLink = el.tagName === "A";
      if (isLink && !touch) return;
      if (isLink && touch && current === el && pinned) return;
      if (isLink) event.preventDefault();
      if (current === el && pinned) hideTip();
      else showTip(el, true);
    });
    el.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideTip();
    });
  }

  function infoIcon() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "8");
    circle.setAttribute("cy", "8");
    circle.setAttribute("r", "6.25");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "currentColor");
    circle.setAttribute("stroke-width", "1.4");
    var stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
    stem.setAttribute("d", "M8 7.2v4.2");
    stem.setAttribute("stroke", "currentColor");
    stem.setAttribute("stroke-width", "1.4");
    stem.setAttribute("stroke-linecap", "round");
    var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", "8");
    dot.setAttribute("cy", "5");
    dot.setAttribute("r", "0.8");
    dot.setAttribute("fill", "currentColor");
    svg.append(circle, stem, dot);
    return svg;
  }

  function render(events) {
    hideTip();
    var valid = events.filter(function (event) {
      return event && isIsoDate(event.date) && typeof event.title === "string" && event.title.trim() && typeof event.summary === "string" && event.summary.trim();
    });

    valid.sort(function (a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });

    countEl.textContent = valid.length === 1 ? "1 event" : valid.length + " events";

    if (!valid.length) {
      setMessage("No events yet.");
      return;
    }

    list.classList.remove("is-message");
    list.replaceChildren();

    var lastYear = "";
    valid.forEach(function (event, index) {
      var year = event.date.slice(0, 4);
      if (year !== lastYear) {
        lastYear = year;
        var yearItem = document.createElement("li");
        yearItem.className = "year-mark";
        var yearHeading = document.createElement("h2");
        yearHeading.textContent = year;
        yearItem.appendChild(yearHeading);
        list.appendChild(yearItem);
      }

      var item = document.createElement("li");
      item.className = "event";
      item.dataset.side = index % 2 === 0 ? "left" : "right";

      var marker = document.createElement("div");
      marker.className = "marker";
      marker.setAttribute("aria-hidden", "true");
      var dot = document.createElement("span");
      dot.className = "dot";
      marker.appendChild(dot);

      var article = document.createElement("article");
      article.className = "card";

      var imagePath = safeImage(event.image);
      var fullPath = safeImage(event.imageFull) || imagePath;
      var imageNote = noteText(event.imageNote);
      if (imagePath) {
        var figure = document.createElement("figure");
        var img = document.createElement("img");
        img.src = imagePath;
        img.alt = typeof event.imageAlt === "string" ? event.imageAlt : "";
        img.width = 640;
        img.height = 450;
        var figureButton = document.createElement("button");
        figureButton.type = "button";
        figureButton.className = "figure-tip";
        if (imageNote) {
          figureButton.setAttribute("data-tip", imageNote);
          figureButton.setAttribute("aria-expanded", "false");
        }
        figureButton.setAttribute("aria-haspopup", "dialog");
        var zoom = document.createElement("span");
        zoom.className = "zoom-label";
        zoom.textContent = "Enlarge";
        figureButton.append(img, zoom);
        figureButton.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          openViewer(fullPath, img.alt, imageNote);
        });
        if (imageNote) bindTip(figureButton, { click: false });
        figure.appendChild(figureButton);
        article.appendChild(figure);
      }

      var body = document.createElement("div");
      body.className = "card-body";

      var top = document.createElement("div");
      top.className = "card-top";

      var dateNote = noteText(event.dateNote);
      var time = document.createElement("time");
      time.dateTime = event.date;
      time.textContent = formatDate(event.date);
      if (dateNote) {
        var dateButton = document.createElement("button");
        dateButton.type = "button";
        dateButton.className = "date-tip";
        dateButton.setAttribute("data-tip", dateNote);
        dateButton.setAttribute("aria-expanded", "false");
        dateButton.appendChild(time);
        top.appendChild(dateButton);
        bindTip(dateButton);
      } else {
        top.appendChild(time);
      }

      var cardNote = noteText(event.note);
      if (cardNote) {
        var info = document.createElement("button");
        info.type = "button";
        info.className = "info-tip";
        info.setAttribute("data-tip", cardNote);
        info.setAttribute("aria-label", "About this summary");
        info.setAttribute("aria-expanded", "false");
        info.appendChild(infoIcon());
        top.appendChild(info);
        bindTip(info);
      }

      var title = document.createElement("h3");
      title.textContent = event.title;

      var summary = document.createElement("p");
      summary.textContent = event.summary;

      var sources = document.createElement("ul");
      sources.className = "sources";
      var sourceList = Array.isArray(event.sources) ? event.sources : [];
      sourceList.forEach(function (source) {
        if (!source) return;
        var href = safeHttpUrl(source.url);
        if (!href) return;
        var sourceItem = document.createElement("li");
        var link = document.createElement("a");
        link.href = href;
        link.textContent = typeof source.label === "string" && source.label.trim() ? source.label : "Source";
        var sourceNote = noteText(source.note);
        if (sourceNote) {
          link.setAttribute("data-tip", sourceNote);
          bindTip(link);
        }
        sourceItem.appendChild(link);
        sources.appendChild(sourceItem);
      });

      body.append(top, title, summary, sources);
      article.appendChild(body);
      item.append(marker, article);
      list.appendChild(item);
    });
  }

  var viewer = document.getElementById("viewer");
  var viewerImg = document.getElementById("viewer-img");
  var viewerCap = document.getElementById("viewer-cap");

  function openViewer(src, alt, caption) {
    hideTip();
    viewerImg.src = src;
    viewerImg.alt = alt || "";
    viewerCap.textContent = caption || "";
    viewerCap.hidden = !caption;
    if (typeof viewer.showModal === "function" && !viewer.open) viewer.showModal();
  }

  document.getElementById("viewer-close").addEventListener("click", function () {
    viewer.close();
  });
  viewer.addEventListener("click", function (event) {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", function () {
    viewerImg.removeAttribute("src");
  });

  document.addEventListener("pointerdown", function (event) {
    if (!pinned || !current) return;
    if (event.target === current || current.contains(event.target)) return;
    hideTip();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") hideTip();
  });

  window.addEventListener("scroll", function () {
    if (current && !pop.hidden) placeTip(current);
  }, true);

  window.addEventListener("resize", function () {
    if (current && !pop.hidden) placeTip(current);
  });

  fetch("events.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Could not load events");
      return response.json();
    })
    .then(function (data) {
      render(data && Array.isArray(data.events) ? data.events : []);
    })
    .catch(function () {
      countEl.textContent = "";
      setMessage("The timeline could not be loaded.", true);
    });
})();
