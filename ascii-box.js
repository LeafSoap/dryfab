/* ============================================================
   ascii-box.js
   Renders declarative ASCII boxes that fit their container.

   Usage:
     <pre class="ascii-box" data-box='{ "title": "...", "items": [...] }'>
       raw text fallback (shown if JS is off)
     </pre>

   The box is REDRAWN (not font-scaled) to whatever character width
   fits the container, so there is no horizontal scrolling on mobile.
   Font size stays constant.

   Item types:
     { "type": "p",     "text": "..." }                 paragraph (wrapped)
     { "type": "li",    "text": "..." }                 bullet "- ..." (hanging indent)
     { "type": "kv",    "key": "...", "val": "..." }     "key .... value" row
     { "type": "split", "left": "...", "right": "..." }  left text, right-aligned text
     { "type": "gap" }                                   blank line
   ============================================================ */
(function () {
  "use strict";

  var MAX_COLS = 61; // interior width cap (matches the original desktop look)
  var MIN_COLS = 30; // never go narrower than this (keeps emails/URLs on one line)
  var PAD = 3;       // left/right padding inside the border

  // Measure the pixel width of a single monospace character for an element.
  function charWidth(el) {
    var probe = document.createElement("span");
    probe.textContent = "0000000000"; // 10 chars for a stable average
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "pre";
    el.appendChild(probe);
    var w = probe.getBoundingClientRect().width / 10;
    el.removeChild(probe);
    return w || 8; // fallback if measurement fails
  }

  // Word-wrap a string to a given width. Returns an array of lines.
  function wrap(text, width) {
    var words = String(text).split(/\s+/).filter(Boolean);
    var lines = [];
    var line = "";
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (!line.length) {
        line = word;
      } else if ((line + " " + word).length <= width) {
        line += " " + word;
      } else {
        lines.push(line);
        line = word;
      }
      // Hard-break a single word longer than the width.
      while (line.length > width) {
        lines.push(line.slice(0, width));
        line = line.slice(width);
      }
    }
    if (line.length) lines.push(line);
    return lines.length ? lines : [""];
  }

  function repeat(ch, n) { return n > 0 ? new Array(n + 1).join(ch) : ""; }
  function padRight(s, n) { return s + repeat(" ", n - s.length); }

  // Build the array of interior text lines (without borders) for the items.
  function buildInner(items, inner) {
    var lines = [];
    var hang = "  "; // hanging indent for bullet continuation

    // Pre-pass: widest left label across all "row" items, so names form a
    // clean aligned column with the roles starting at the same spot.
    var rowLeftW = 0;
    items.forEach(function (it) {
      if (it.type === "row") rowLeftW = Math.max(rowLeftW, (it.left || "").length);
    });

    items.forEach(function (item) {
      switch (item.type) {
        case "gap":
          lines.push("");
          break;

        case "p":
          // Separate consecutive paragraphs with a blank line.
          if (lines.length && lines[lines.length - 1] !== "") lines.push("");
          wrap(item.text, inner).forEach(function (l) { lines.push(l); });
          break;

        case "li":
          var liWrapped = wrap(item.text, inner - 2);
          liWrapped.forEach(function (l, idx) {
            lines.push((idx === 0 ? "- " : hang) + l);
          });
          break;

        case "kv":
          // "key .... value" — dots fill the gap. Values are emails/URLs,
          // so never hard-break them; drop to an indented line if too long.
          var key = item.key;
          var val = item.val;
          var dots = Math.max(1, 10 - key.length);
          var prefix = key + " " + repeat(".", dots) + "  ";
          if ((prefix + val).length <= inner) {
            lines.push(prefix + val);
          } else {
            // value doesn't fit on the key line: key on its own line,
            // value indented on the next (kept whole; overflow-x is the
            // safety net only on absurdly narrow screens).
            lines.push(prefix.replace(/\s+$/, ""));
            lines.push("    " + val);
          }
          break;

        case "split":
          // left text with right text pushed to the right edge
          var left = item.left || "";
          var right = item.right || "";
          if ((left.length + 1 + right.length) <= inner) {
            lines.push(left + repeat(" ", inner - left.length - right.length) + right);
          } else {
            lines.push(left);
            lines.push(repeat(" ", Math.max(0, inner - right.length)) + right);
          }
          break;

        case "row":
          // "left - right" with left padded to a shared column width, so a
          // group of rows (e.g. name - role) lines up cleanly.
          var rl = item.left || "";
          var rr = item.right || "";
          var padded = padRight(rl, rowLeftW);
          var oneLine = padded + " - " + rr;
          if (oneLine.length <= inner) {
            lines.push(oneLine);
          } else {
            // too narrow for a shared column: stack role under the name
            lines.push(rl);
            wrap(rr, inner - 4).forEach(function (l) { lines.push("    " + l); });
          }
          break;

        default:
          wrap(item.text || "", inner).forEach(function (l) { lines.push(l); });
      }
    });

    return lines;
  }

  // Draw a full box string for the given interior column count.
  function draw(data, cols) {
    var inner = cols;               // chars available between the "|  " and "  |"
    var contentW = inner - PAD * 2; // actual text area width

    // Build content first so we can guarantee the box is wide enough for
    // every line (prevents a stray long line from breaking the border).
    var inner_lines = buildInner(data.items || [], contentW);
    var longest = inner_lines.reduce(function (m, l) {
      return Math.max(m, l.length + PAD); // + left padding
    }, 0);
    if (longest > inner) inner = longest;

    var top;
    if (data.title) {
      var label = "[ " + data.title + " ]";
      var dashTotal = inner + 2 - label.length; // +2 for the two corner-adjacent chars
      var leftDash = Math.floor(dashTotal / 2);
      var rightDash = dashTotal - leftDash;
      top = "+" + repeat("-", leftDash) + label + repeat("-", rightDash) + "+";
    } else {
      top = "+" + repeat("-", inner + 2) + "+";
    }

    var bottom = "+" + repeat("-", inner + 2) + "+";

    var out = [top];
    out.push("|" + repeat(" ", inner + 2) + "|"); // blank spacer line

    inner_lines.forEach(function (l) {
      var padded = repeat(" ", PAD) + l;
      padded = padRight(padded, inner + 2);
      out.push("|" + padded + "|");
    });

    out.push("|" + repeat(" ", inner + 2) + "|"); // blank spacer line
    out.push(bottom);
    return out.join("\n");
  }

  function renderOne(el) {
    var data;
    try {
      data = JSON.parse(el.getAttribute("data-box"));
    } catch (e) {
      // Leave the raw fallback text in place, but surface the error so a
      // malformed data-box (e.g. an unescaped apostrophe) isn't silent.
      if (window.console && console.warn) {
        console.warn("ascii-box: could not parse data-box, showing raw text.", e);
      }
      return;
    }

    // Available width: the panel/container the box lives in.
    var container = el.parentElement || el;
    var availPx = container.clientWidth;
    if (!availPx) return; // hidden/zero-width; will be rendered when shown

    var cw = charWidth(el);
    // How many interior columns fit? Account for the 2 border chars + 2 edge spaces.
    var fit = Math.floor(availPx / cw) - 4;
    var cols = Math.max(MIN_COLS, Math.min(MAX_COLS, fit));

    var text = draw(data, cols);

    // Render as HTML so the title label can be colored, but escape first
    // so the box content is treated as plain text (no injection).
    var html = escapeHtml(text);
    if (data.title) {
      var label = "[ " + data.title + " ]";
      var escLabel = escapeHtml(label);
      // Only the title lives on the top border line; replace its one match.
      html = html.replace(escLabel, '<span class="box-title">' + escLabel + "</span>");
    }
    el.innerHTML = html;
    el.classList.add("drawn");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderAll() {
    var boxes = document.querySelectorAll(".ascii-box[data-box]");
    boxes.forEach(function (el) { renderOne(el); });
  }

  // Debounced resize handling.
  var t;
  function onResize() {
    clearTimeout(t);
    t = setTimeout(renderAll, 100);
  }

  // Public API. `draw(data, cols)` is exposed so the same box can be
  // generated anywhere (not just from .ascii-box elements).
  window.AsciiBox = { renderAll: renderAll, renderOne: renderOne, draw: draw };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
})();
