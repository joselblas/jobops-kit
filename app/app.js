/* Job Ops dashboard. No dependencies, no network. Reads tracker.csv in the browser. */
(function () {
  "use strict";

  var DIMS = ["domain", "skill", "level", "evidence", "terms"];
  var DIM_LABEL = { domain: "Domain", skill: "Skills", level: "Level", evidence: "Evidence", terms: "Terms" };
  var NS = "http://www.w3.org/2000/svg";

  var state = { rows: [], selected: null, filter: "all", q: "", sortKey: "date_found", sortDir: -1, ref: new Date(), label: "" };

  function $(s) { return document.querySelector(s); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- CSV ---------- */
  function parseCSV(text) {
    var rows = [], row = [], cur = "", inQ = false, i, c;
    text = text.replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; } }
        else { cur += c; }
      } else if (c === '"') { inQ = true; }
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); cur = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else { cur += c; }
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var o = {};
      head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); });
      return o;
    });
  }

  function toDate(s) {
    if (!s) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    return null;
  }
  function days(a, b) { return Math.round((b - a) / 86400000); }

  function normalise(r) {
    var o = {};
    for (var k in r) o[k] = r[k];
    o.score = r.score === "" || isNaN(parseFloat(r.score)) ? null : parseFloat(r.score);
    o.gate = r.gate_result || "";
    o.gated = o.gate.indexOf("fail") === 0;
    o.applied = (r.status || "") === "applied";
    o.outcome = r.outcome || "";
    o.dims = null;
    var vals = DIMS.map(function (d) { return parseFloat(r[d]); });
    if (vals.every(function (v) { return !isNaN(v); })) o.dims = vals;
    o.dFound = toDate(r.date_found);
    o.dApplied = toDate(r.date_applied);
    o.dOutcome = toDate(r.date_outcome);
    if (o.gated) { o.stateKey = "gated"; o.stateText = "Gated: " + o.gate.replace(/^fail:?/, ""); }
    else if (o.applied && !o.outcome) { o.stateKey = "waiting"; o.stateText = "Waiting"; }
    else if (o.outcome === "interview" || o.outcome === "offer") { o.stateKey = "interview"; o.stateText = o.outcome === "offer" ? "Offer" : "Interview"; }
    else if (o.outcome.indexOf("rejected") === 0) { o.stateKey = "rejected"; o.stateText = o.outcome === "rejected-auto" ? "Rejected, auto" : "Rejected"; }
    else if (o.outcome === "withdrawn") { o.stateKey = "rejected"; o.stateText = "Withdrawn"; }
    else { o.stateKey = "other"; o.stateText = (r.status || "Logged"); }
    return o;
  }

  /* ---------- Load ---------- */
  function load(text, label) {
    var raw = parseCSV(text);
    state.rows = raw.filter(function (r) { return r.company || r.role; }).map(normalise);
    state.label = label;
    var latest = null;
    state.rows.forEach(function (r) {
      [r.dFound, r.dApplied, r.dOutcome].forEach(function (d) { if (d && (!latest || d > latest)) latest = d; });
    });
    var today = new Date();
    if (latest) {
      var cap = new Date(latest.getTime() + 3 * 86400000);
      state.ref = cap < today ? cap : today;
    } else { state.ref = today; }
    var best = state.rows.filter(function (r) { return r.score != null; }).sort(function (a, b) { return b.score - a.score; })[0];
    state.selected = best || null;
    state.filter = "all"; state.q = ""; $("#q").value = "";
    render();
  }

  /* ---------- Render ---------- */
  function render() {
    renderMeta(); renderKpis(); renderFunnel(); renderFit(); renderSwarm();
    renderGates(); renderSources(); renderWaiting(); renderChips(); renderTable();
  }

  function stats() {
    var rows = state.rows;
    var applied = rows.filter(function (r) { return r.applied; });
    var heard = applied.filter(function (r) { return r.outcome; });
    var inter = applied.filter(function (r) { return r.stateKey === "interview"; });
    var gated = rows.filter(function (r) { return r.gated; });
    return { rows: rows, applied: applied, heard: heard, inter: inter, gated: gated };
  }
  function pct(a, b) { return b ? Math.round(100 * a / b) + "%" : "n/a"; }

  function renderMeta() {
    var s = stats();
    $("#meta").textContent = (state.label || "Tracker") + "  ·  " + s.rows.length + " listings  ·  as of " + state.ref.toISOString().slice(0, 10);
  }

  function renderKpis() {
    var s = stats();
    var items = [
      [s.rows.length, "Logged", ""],
      [s.gated.length, "Stopped at a gate", ""],
      [s.applied.length, "Applied", ""],
      [pct(s.heard.length, s.applied.length), "Heard back", ""],
      [s.inter.length, "Interview or better", "accent"]
    ];
    $("#kpis").innerHTML = items.map(function (i) {
      return '<div class="kpi ' + i[2] + '"><div class="n">' + esc(i[0]) + '</div><div class="l">' + esc(i[1]) + "</div></div>";
    }).join("");
  }

  function renderFunnel() {
    var s = stats();
    var steps = [
      ["Logged", s.rows.length],
      ["Passed gates", s.rows.length - s.gated.length],
      ["Applied", s.applied.length],
      ["Heard back", s.heard.length],
      ["Interview or better", s.inter.length]
    ];
    var top = steps[0][1] || 1;
    $("#funnel").innerHTML = steps.map(function (st, i) {
      var of = i ? steps[i - 1][1] : 0;
      var sub = i ? pct(st[1], of) + " of previous" : "";
      return '<div class="f-row"><div class="f-label">' + esc(st[0]) + '</div>' +
        '<div class="f-track"><div class="f-bar" style="width:' + (100 * st[1] / top) + '%"></div></div>' +
        '<div class="f-val">' + st[1] + (sub ? "<small>" + sub + "</small>" : "") + "</div></div>";
    }).join("");
    var n = s.applied.length;
    $("#caveat").textContent = n < 30
      ? "Only " + n + " applications. Treat every comparison here as a hint, not a result."
      : "Buckets under about 30 applications are still noisy. Read with care.";
  }

  function tagFor(r) {
    var cls = r.stateKey === "interview" ? "gold" : r.stateKey === "rejected" ? "rust" : "";
    return '<span class="tag ' + cls + '">' + esc(r.stateText) + "</span>";
  }

  function renderFit() {
    var scored = state.rows.filter(function (r) { return r.score != null; })
      .sort(function (a, b) { return b.score - a.score; });
    var ol = $("#fitList");
    if (!scored.length) { ol.innerHTML = '<li class="empty" style="padding:16px 0">No scored listings yet.</li>'; renderRadar(); return; }
    ol.innerHTML = scored.map(function (r, i) {
      var sel = r === state.selected;
      return '<li class="fit-item" tabindex="0" role="option" aria-selected="' + sel + '" data-i="' + state.rows.indexOf(r) + '">' +
        '<span class="fit-score">' + r.score.toFixed(1) + "</span>" +
        '<span><span class="fit-co">' + esc(r.company) + '</span><br><span class="fit-role">' + esc(r.role) + "</span></span>" +
        tagFor(r) + "</li>";
    }).join("");
    ol.setAttribute("role", "listbox");
    renderRadar();
  }

  function pt(cx, cy, r, k, n) {
    var a = -Math.PI / 2 + (2 * Math.PI * k) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function renderRadar() {
    var r = state.selected, card = $("#radarCard");
    if (!r) { card.innerHTML = '<p class="empty">Select an opportunity.</p>'; return; }
    var head = "<h3>" + esc(r.company) + '</h3><p class="sub">' + esc(r.role) + " · " + (r.score != null ? "overall " + r.score.toFixed(1) + " / 5" : "unscored") + " · " + esc(r.stateText) + "</p>";
    if (!r.dims) {
      card.innerHTML = head + '<p class="radar-note">No dimension scores for this row. Add <code>domain, skill, level, evidence, terms</code> columns (1 to 5) to see the profile.</p>' +
        (r.notes ? '<p class="radar-note">' + esc(r.notes) + "</p>" : "");
      return;
    }
    var size = 360, c = size / 2, R = 120, n = DIMS.length, svg = "";
    for (var ring = 1; ring <= 5; ring++) {
      var poly = DIMS.map(function (_, k) { return pt(c, c, R * ring / 5, k, n).join(","); }).join(" ");
      svg += '<polygon points="' + poly + '" fill="none" stroke="#2b2b2f" stroke-width="1"/>';
    }
    DIMS.forEach(function (d, k) {
      var e = pt(c, c, R, k, n), l = pt(c, c, R + 26, k, n);
      svg += '<line x1="' + c + '" y1="' + c + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="#2b2b2f"/>';
      var anchor = l[0] < c - 8 ? "end" : l[0] > c + 8 ? "start" : "middle";
      svg += '<text x="' + l[0] + '" y="' + (l[1] + 4) + '" text-anchor="' + anchor + '" fill="#8d8a83" font-size="12" letter-spacing="1.2" font-family="-apple-system,Helvetica,Arial,sans-serif">' + DIM_LABEL[d].toUpperCase() + "</text>";
    });
    var shape = r.dims.map(function (v, k) { return pt(c, c, R * Math.max(0, Math.min(5, v)) / 5, k, n).join(","); }).join(" ");
    svg += '<polygon points="' + shape + '" fill="rgba(194,168,120,0.16)" stroke="#c2a878" stroke-width="1.6" stroke-linejoin="round"/>';
    r.dims.forEach(function (v, k) {
      var p = pt(c, c, R * v / 5, k, n);
      svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="#c2a878"/>';
    });
    var list = DIMS.map(function (d, k) {
      return "<li><span>" + DIM_LABEL[d] + '</span><span class="dim-bar"><i style="width:' + (r.dims[k] * 20) + '%"></i></span><b>' + r.dims[k] + "</b></li>";
    }).join("");
    card.innerHTML = head +
      '<svg viewBox="-60 0 ' + (size + 120) + " " + size + '" role="img" aria-label="Fit profile for ' + esc(r.company) + ": " +
      DIMS.map(function (d, k) { return DIM_LABEL[d] + " " + r.dims[k]; }).join(", ") + '">' + svg + "</svg>" +
      '<ul class="dim-list">' + list + "</ul>" +
      (r.notes ? '<p class="radar-note">' + esc(r.notes) + "</p>" : "");
  }

  function renderSwarm() {
    var apps = state.rows.filter(function (r) { return r.applied && r.score != null; });
    var box = $("#swarm");
    if (!apps.length) { box.innerHTML = '<p class="empty">No scored applications yet.</p>'; return; }
    var W = 1000, H = 200, padL = 20, padR = 20, base = 140;
    var min = Math.min(3, Math.floor(Math.min.apply(null, apps.map(function (a) { return a.score; }))));
    var max = 5;
    function x(s) { return padL + (W - padL - padR) * (s - min) / (max - min); }
    var svg = '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + base + '" y2="' + base + '" stroke="#323236"/>';
    for (var t = min; t <= max + 0.001; t += 0.5) {
      svg += '<line x1="' + x(t) + '" x2="' + x(t) + '" y1="' + base + '" y2="' + (base + 6) + '" stroke="#323236"/>' +
        '<text x="' + x(t) + '" y="' + (base + 26) + '" text-anchor="middle" fill="#8d8a83" font-size="13" font-family="-apple-system,Helvetica,Arial,sans-serif">' + t.toFixed(1) + "</text>";
    }
    var gx = x(4);
    svg += '<line x1="' + gx + '" x2="' + gx + '" y1="14" y2="' + base + '" stroke="#c2a878" stroke-dasharray="3 5" opacity="0.6"/>' +
      '<text x="' + (gx + 8) + '" y="24" fill="#c2a878" font-size="12" letter-spacing="1.2" font-family="-apple-system,Helvetica,Arial,sans-serif">RECOMMEND</text>';
    var buckets = {};
    apps.slice().sort(function (a, b) { return a.score - b.score; }).forEach(function (a) {
      var key = Math.round(a.score * 10);
      var k = buckets[key] = (buckets[key] || 0) + 1;
      var cy = base - 12 - (k - 1) * 20;
      var cx = x(a.score);
      var title = esc(a.company) + ", " + a.score.toFixed(1) + ", " + esc(a.stateText);
      if (a.stateKey === "interview") svg += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#c2a878"><title>' + title + "</title></circle>";
      else if (a.stateKey === "rejected") svg += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#5c5a56"><title>' + title + "</title></circle>";
      else svg += '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="none" stroke="#ece8e0" stroke-width="1.5"><title>' + title + "</title></circle>";
    });
    box.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Applications placed by fit score, coloured by outcome">' + svg + "</svg>" +
      '<div class="legend"><span class="l-int">Interview or better</span><span class="l-rej">Rejected</span><span class="l-wait">Waiting</span></div>';
  }

  function renderGates() {
    var counts = {};
    state.rows.filter(function (r) { return r.gated; }).forEach(function (r) {
      var k = r.gate.replace(/^fail:?/, "") || "other";
      counts[k] = (counts[k] || 0) + 1;
    });
    var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    if (!keys.length) { $("#gates").innerHTML = '<p class="empty">None logged.</p>'; return; }
    var top = counts[keys[0]];
    $("#gates").innerHTML = keys.map(function (k) {
      return '<div class="b-row"><span class="b-label">' + esc(k) + '</span><span class="b-track"><i style="width:' + (100 * counts[k] / top) + '%"></i></span><span class="b-val">' + counts[k] + "</span></div>";
    }).join("");
  }

  function renderSources() {
    var by = {};
    state.rows.filter(function (r) { return r.applied; }).forEach(function (r) {
      var s = r.source || "unknown";
      by[s] = by[s] || { a: 0, h: 0, i: 0 };
      by[s].a++; if (r.outcome) by[s].h++; if (r.stateKey === "interview") by[s].i++;
    });
    var keys = Object.keys(by).sort(function (a, b) { return by[b].a - by[a].a; });
    if (!keys.length) { $("#sources").innerHTML = '<p class="empty">No applications yet.</p>'; return; }
    var top = by[keys[0]].a;
    $("#sources").innerHTML = keys.map(function (k) {
      var v = by[k];
      return '<div class="b-row"><span class="b-label">' + esc(k) + '</span><span class="b-track"><i style="width:' + (100 * v.a / top) + '%"></i></span><span class="b-val">' + v.a + " / " + v.h + " / " + v.i + "</span></div>";
    }).join("");
  }

  function renderWaiting() {
    var list = state.rows.filter(function (r) { return r.stateKey === "waiting" && r.dApplied; })
      .map(function (r) { return { r: r, d: days(r.dApplied, state.ref) }; })
      .filter(function (x) { return x.d >= 14; })
      .sort(function (a, b) { return b.d - a.d; });
    $("#waiting").innerHTML = list.length ? list.map(function (x) {
      return '<li><span class="d">' + x.d + "<small>DAYS</small></span><span>" + esc(x.r.company) + ' <span class="fit-role">' + esc(x.r.role) + "</span></span>" +
        (x.d >= 30 ? '<span class="tag gold">30+ follow up</span>' : '<span class="tag">14+</span>') + "</li>";
    }).join("") : '<li class="empty">Nothing waiting 14 days or more.</li>';
  }

  var CHIPS = [["all", "All"], ["applied", "Applied"], ["waiting", "Waiting"], ["interview", "Interview"], ["rejected", "Rejected"], ["gated", "Gated"]];
  function renderChips() {
    $("#chips").innerHTML = CHIPS.map(function (c) {
      return '<button class="chip" type="button" data-f="' + c[0] + '" aria-pressed="' + (state.filter === c[0]) + '">' + c[1] + "</button>";
    }).join("");
  }

  function visibleRows() {
    var q = state.q.toLowerCase();
    var rows = state.rows.filter(function (r) {
      if (state.filter === "applied" && !r.applied) return false;
      if (state.filter !== "all" && state.filter !== "applied" && r.stateKey !== state.filter) return false;
      if (q && (r.company + " " + r.role + " " + (r.notes || "") + " " + (r.source || "")).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var k = state.sortKey, dir = state.sortDir;
    rows.sort(function (a, b) {
      var va, vb;
      if (k === "score") { va = a.score == null ? -1 : a.score; vb = b.score == null ? -1 : b.score; }
      else if (k === "date_found") { va = a.dFound ? a.dFound.getTime() : 0; vb = b.dFound ? b.dFound.getTime() : 0; }
      else if (k === "state") { va = a.stateText; vb = b.stateText; }
      else { va = (a[k] || "").toLowerCase(); vb = (b[k] || "").toLowerCase(); }
      return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
    });
    return rows;
  }

  function renderTable() {
    var rows = visibleRows();
    $("#count").textContent = rows.length + " of " + state.rows.length + " listings";
    $("#table tbody").innerHTML = rows.map(function (r) {
      return '<tr class="row" tabindex="0" data-i="' + state.rows.indexOf(r) + '">' +
        '<td class="muted">' + esc(r.date_found) + "</td><td>" + esc(r.company) + '</td><td class="muted">' + esc(r.role) + '</td><td class="muted">' + esc(r.source) + "</td>" +
        '<td class="num score">' + (r.score != null ? r.score.toFixed(1) : "") + "</td><td>" + tagFor(r) + "</td></tr>";
    }).join("") || '<tr><td colspan="6" class="empty">No listings match.</td></tr>';
    document.querySelectorAll("#table th").forEach(function (th) {
      th.removeAttribute("aria-sort");
      if (th.dataset.sort === state.sortKey) th.setAttribute("aria-sort", state.sortDir > 0 ? "ascending" : "descending");
    });
  }

  /* ---------- Events ---------- */
  function select(i) {
    var r = state.rows[i];
    if (!r) return;
    state.selected = r;
    renderFit();
    if (window.matchMedia("(max-width: 880px)").matches) $("#radarCard").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  $("#fitList").addEventListener("click", function (e) { var li = e.target.closest(".fit-item"); if (li) select(+li.dataset.i); });
  $("#fitList").addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { var li = e.target.closest(".fit-item"); if (li) { e.preventDefault(); select(+li.dataset.i); } }
  });
  $("#table tbody").addEventListener("click", function (e) { var tr = e.target.closest("tr.row"); if (tr) select(+tr.dataset.i); });
  $("#table tbody").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { var tr = e.target.closest("tr.row"); if (tr) select(+tr.dataset.i); }
  });
  $("#chips").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    state.filter = b.dataset.f; renderChips(); renderTable();
  });
  $("#q").addEventListener("input", function (e) { state.q = e.target.value; renderTable(); });
  document.querySelectorAll("#table th").forEach(function (th) {
    th.tabIndex = 0;
    function go() {
      var k = th.dataset.sort;
      if (state.sortKey === k) state.sortDir *= -1;
      else { state.sortKey = k; state.sortDir = (k === "score" || k === "date_found") ? -1 : 1; }
      renderTable();
    }
    th.addEventListener("click", go);
    th.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  function readFile(file) {
    if (!file) return;
    var fr = new FileReader();
    fr.onload = function () { load(String(fr.result), file.name); };
    fr.readAsText(file);
  }
  $("#file").addEventListener("change", function (e) { readFile(e.target.files[0]); e.target.value = ""; });
  $("#btnSample").addEventListener("click", function () { load(window.SAMPLE_CSV, "Sample data (fictional)"); });

  ["dragenter", "dragover"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); document.body.classList.add("dragging"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); document.body.classList.remove("dragging"); });
  });
  document.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files.length) readFile(e.dataTransfer.files[0]); });

  load(window.SAMPLE_CSV || "", "Sample data (fictional)");
})();
