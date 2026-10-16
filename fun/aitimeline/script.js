/*
 * Renders fun/aitimeline/events.json as a vertical timeline, sorted by date.
 * To add an event, edit events.json and add an SVG under images/. See README.md.
 */
(function () {
  var list = document.getElementById("timeline");
  var countEl = document.getElementById("count");

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
    if (!/^images\/[A-Za-z0-9][A-Za-z0-9._-]*\.svg$/.test(path)) return "";
    return path;
  }

  function render(events) {
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
      if (imagePath) {
        var figure = document.createElement("figure");
        var img = document.createElement("img");
        img.src = imagePath;
        img.alt = typeof event.imageAlt === "string" ? event.imageAlt : "";
        img.width = 800;
        img.height = 500;
        figure.appendChild(img);
        article.appendChild(figure);
      }

      var body = document.createElement("div");
      body.className = "card-body";

      var time = document.createElement("time");
      time.dateTime = event.date;
      time.textContent = formatDate(event.date);

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
        sourceItem.appendChild(link);
        sources.appendChild(sourceItem);
      });

      body.append(time, title, summary, sources);
      article.appendChild(body);
      item.append(marker, article);
      list.appendChild(item);
    });
  }

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
