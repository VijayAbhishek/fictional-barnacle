/* Tiger Fitness — Progress tab: body-weight log, trend chart, milestones, settings & data tools. */
(function () {
  'use strict';

  var h, icon, clear, table, toast;
  var M, S, P;

  function boot() {
    var ui = window.TF_UI;
    h = ui.h; icon = ui.icon; clear = ui.clear; table = ui.table; toast = ui.toast;
    M = window.TF_MODEL; S = window.TF_STORE; P = window.TF_PROGRAM;
  }

  function activate() { render(); }

  function entries() {
    var log = S.weightLog();
    return Object.keys(log).sort().map(function (d) { return { date: d, kg: log[d] }; });
  }

  function render() {
    var host = document.getElementById('progress-content');
    if (!host) return;
    var frag = document.createDocumentFragment();
    var add = function (n) { window.TF_UI.append(frag, n); };
    var rows = entries();
    var latest = rows.length ? rows[rows.length - 1] : null;
    var start = P.meta.startWeightKg;
    var lost = latest ? Math.round((start - latest.kg) * 100) / 100 : 0;

    add(h('div', { class: 'stats-grid' }, [
      [start + ' kg', 'Start'],
      [latest ? latest.kg + ' kg' : '—', 'Latest'],
      [latest ? (lost > 0 ? '-' + lost : '+' + (-lost)) + ' kg' : '—', 'Change'],
      [P.meta.targetKg + ' kg', 'Target']
    ].map(function (s) {
      return h('div', { class: 'stat-tile' }, h('div', { class: 'val' }, s[0]), h('div', { class: 'label' }, s[1]));
    })));

    // ---- add entry ----
    var dateInput = h('input', { type: 'date', id: 'w-date', value: M.todayStr() });
    var kgInput = h('input', { type: 'number', id: 'w-kg', min: '30', max: '250', step: '0.05', placeholder: 'kg', inputmode: 'decimal' });
    add(h('div', { class: 'card' },
      h('h3', { class: 'section-title' }, 'LOG YOUR WEIGHT'),
      h('p', { class: 'lead' }, 'Weigh at the SAME time — after the morning pee, before food/water.'),
      h('div', { class: 'wlog-row' },
        h('label', { class: 'sr-only', for: 'w-date' }, 'Date'),
        dateInput,
        h('label', { class: 'sr-only', for: 'w-kg' }, 'Weight in kilograms'),
        kgInput,
        h('button', {
          type: 'button', class: 'gmark gdone-btn', onclick: function () {
            var d = dateInput.value, kg = parseFloat(kgInput.value);
            if (!M.isDateStr(d)) { toast('Pick a valid date', 'warn'); return; }
            if (isNaN(kg) || kg < 30 || kg > 250) { toast('Weight must be 30–250 kg', 'warn'); return; }
            S.setWeight(d, kg);
            toast('Logged ' + kg + ' kg for ' + d);
            render();
          }
        }, icon('plus'), ' Save'))));

    // ---- chart ----
    add(h('div', { class: 'card' },
      h('h3', { class: 'section-title' }, 'WEIGHT TREND'),
      rows.length ? chart(rows) : h('p', { class: 'lead' }, 'No entries yet — log your first weigh-in above. The chart plots your trend against the 87–90 kg target band.')));

    // ---- milestones ----
    add(h('div', { class: 'card' },
      h('h3', { class: 'section-title' }, 'MILESTONE CHECKPOINTS'),
      table(['Period', 'Expected', 'Lost/Month', 'Total'],
        P.milestones.map(function (m) { return [m.period, m.weight, m.lost, m.total]; })),
      h('p', { class: 'lead' }, P.supplements.reorderNote)));

    // ---- entries table ----
    if (rows.length) {
      add(h('div', { class: 'card' },
        h('h3', { class: 'section-title' }, 'ENTRIES (' + rows.length + ')'),
        h('div', { class: 'table-wrap' },
          h('table', { class: 'info-table' },
            h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Date'), h('th', { scope: 'col' }, 'Weight'), h('th', { scope: 'col' }, ''))),
            h('tbody', {}, rows.slice().reverse().map(function (r) {
              return h('tr', {},
                h('td', {}, r.date),
                h('td', {}, r.kg + ' kg'),
                h('td', {}, h('button', {
                  type: 'button', class: 'link-btn', 'aria-label': 'Delete entry for ' + r.date,
                  onclick: function () { S.setWeight(r.date, null); render(); }
                }, icon('trash'))));
            }))))));
    }

    // ---- settings ----
    add(settingsCard());

    clear(host).appendChild(frag);
  }

  function chart(rows) {
    var NS = 'http://www.w3.org/2000/svg';
    var W = 640, H = 260, padL = 44, padR = 14, padT = 16, padB = 30;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'wchart');
    svg.setAttribute('role', 'img');
    var latest = rows[rows.length - 1];
    svg.setAttribute('aria-label', 'Weight trend chart: ' + rows.length + ' entries, latest ' + latest.kg + ' kg on ' + latest.date);

    var kgs = rows.map(function (r) { return r.kg; });
    var yMax = Math.max(P.meta.startWeightKg, Math.max.apply(null, kgs)) + 1;
    var yMin = Math.min(86, Math.min.apply(null, kgs)) - 1;
    var t0 = new Date(rows[0].date).getTime();
    var t1 = new Date(latest.date).getTime();
    if (t1 === t0) t1 = t0 + 86400000;

    function x(d) { return padL + (new Date(d).getTime() - t0) / (t1 - t0) * (W - padL - padR); }
    function y(kg) { return padT + (yMax - kg) / (yMax - yMin) * (H - padT - padB); }

    function el(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      for (var k in attrs) node.setAttribute(k, attrs[k]);
      return node;
    }

    // target band 87–90
    svg.appendChild(el('rect', {
      x: padL, y: y(90), width: W - padL - padR, height: Math.max(2, y(87) - y(90)),
      fill: 'rgba(0,210,106,0.12)', stroke: 'rgba(0,210,106,0.35)', 'stroke-dasharray': '4 4'
    }));

    // gridlines + labels
    for (var g = Math.ceil(yMin / 5) * 5; g <= yMax; g += 5) {
      svg.appendChild(el('line', { x1: padL, y1: y(g), x2: W - padR, y2: y(g), stroke: 'var(--border)', 'stroke-width': 1 }));
      var lbl = el('text', { x: padL - 6, y: y(g) + 4, 'text-anchor': 'end', class: 'chart-lbl' });
      lbl.textContent = g;
      svg.appendChild(lbl);
    }

    // start reference
    svg.appendChild(el('line', {
      x1: padL, y1: y(P.meta.startWeightKg), x2: W - padR, y2: y(P.meta.startWeightKg),
      stroke: 'var(--orange)', 'stroke-width': 1, 'stroke-dasharray': '2 4', opacity: 0.7
    }));

    // path
    var d = rows.map(function (r, i) { return (i ? 'L' : 'M') + x(r.date).toFixed(1) + ' ' + y(r.kg).toFixed(1); }).join(' ');
    svg.appendChild(el('path', { d: d, fill: 'none', stroke: 'var(--orange)', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    rows.forEach(function (r) {
      svg.appendChild(el('circle', { cx: x(r.date), cy: y(r.kg), r: 3.5, fill: 'var(--orange)', stroke: '#0d0d0d', 'stroke-width': 1.5 }));
    });

    // x labels: first + last
    var lbl0 = el('text', { x: padL, y: H - 8, 'text-anchor': 'start', class: 'chart-lbl' });
    lbl0.textContent = rows[0].date;
    var lbl1 = el('text', { x: W - padR, y: H - 8, 'text-anchor': 'end', class: 'chart-lbl' });
    lbl1.textContent = latest.date;
    svg.appendChild(lbl0);
    svg.appendChild(lbl1);
    return svg;
  }

  /* ---------------- settings & data tools ---------------- */

  function settingsCard() {
    var cfg = M.settings();
    var warmupInput = h('input', { type: 'date', id: 'set-warmup', value: cfg.warmupStart });
    var programInput = h('input', { type: 'date', id: 'set-program', value: cfg.programStart });

    return h('div', { class: 'card', id: 'settings' },
      h('h3', { class: 'section-title' }, icon('gear'), ' SETTINGS'),
      h('div', { class: 'set-row' },
        h('label', { for: 'set-warmup' }, 'Warm-up week starts (4 days)'),
        warmupInput),
      h('div', { class: 'set-row' },
        h('label', { for: 'set-program' }, 'Program Day 1 (90 days)'),
        programInput),
      h('div', { class: 'set-row' },
        h('button', {
          type: 'button', class: 'gmark gdone-btn', onclick: function () {
            var w = warmupInput.value, p = programInput.value;
            if (!M.isDateStr(w) || !M.isDateStr(p)) { toast('Pick valid dates', 'warn'); return; }
            var earliest = M.addDays(w, P.meta.warmupDays);
            if (p < earliest) {
              toast('Day 1 must be on/after ' + earliest + ' (warm-up runs ' + P.meta.warmupDays + ' days)', 'warn');
              return;
            }
            S.setSetting('warmupStart', w);
            S.setSetting('programStart', p);
            M.invalidate();
            toast('Program dates updated — journeys rebuilt');
            document.dispatchEvent(new CustomEvent('tf:dates-changed'));
            render();
          }
        }, icon('check'), ' Save dates')),
      h('p', { class: 'lead' }, 'Logs are stored per calendar date, so changing dates never deletes anything — days simply re-map. Whey phase (half → full scoop) follows program Week 4 automatically.'),

      h('h3', { class: 'section-title' }, 'DATA & PRIVACY'),
      h('p', { class: 'lead' }, 'Everything stays on this device (no account, no cloud, no analytics). Health details live in your browser storage only — export a backup before clearing browser data or switching devices.'),
      h('div', { class: 'set-row wrap' },
        h('button', {
          type: 'button', class: 'gmark gdone-btn', onclick: exportBackup
        }, icon('download'), ' Export backup'),
        h('label', { class: 'gmark file-btn' }, icon('upload'), ' Import backup',
          h('input', {
            type: 'file', accept: '.json,application/json', class: 'sr-only',
            onchange: function (e) { importBackup(e.target); }
          })),
        h('button', {
          type: 'button', class: 'gmark gmiss-btn', onclick: function () {
            if (confirm('Erase ALL Tiger Fitness data on this device (logs, weights, settings)? Export a backup first if unsure.')) {
              S.resetAll();
              M.invalidate();
              toast('All data erased');
              document.dispatchEvent(new CustomEvent('tf:dates-changed'));
              render();
            }
          }
        }, icon('trash'), ' Erase all data')),

      h('h3', { class: 'section-title' }, 'ABOUT'),
      h('p', { class: 'lead' }, 'Tiger Fitness Command Center v2 — offline-first PWA. Install it: open in Chrome/Edge → menu → "Add to Home screen" / "Install app". Works fully offline after the first visit when served over HTTPS or localhost.'),
      h('div', { class: 'stop-inline' }, P.healthNotes.disclaimer));
  }

  function exportBackup() {
    try {
      var blob = new Blob([S.exportJSON()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'tiger-fitness-backup-' + M.todayStr() + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast('Backup downloaded');
    } catch (e) {
      toast('Export failed: ' + e.message, 'warn');
    }
  }

  function importBackup(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        S.importJSON(String(reader.result));
        M.invalidate();
        toast('Backup imported');
        document.dispatchEvent(new CustomEvent('tf:dates-changed'));
        render();
      } catch (e) {
        toast('Import failed: ' + e.message, 'warn');
      }
      input.value = '';
    };
    reader.readAsText(file);
  }

  window.TF_PROGRESS = { boot: boot, activate: activate };
})();
