/* Tiger Fitness — gym & diet bubble-journey trackers (inline accordion, a11y-first). */
(function () {
  'use strict';

  var h, icon, clear, toast, announce, ring;
  var M, S, P;

  var open = { gym: null, diet: null }; // open bubble per tracker

  function boot() {
    var ui = window.TF_UI;
    h = ui.h; icon = ui.icon; clear = ui.clear; toast = ui.toast; announce = ui.announce; ring = ui.ring;
    M = window.TF_MODEL; S = window.TF_STORE; P = window.TF_PROGRAM;
  }

  /* ================= shared journey rendering ================= */

  function statusOf(type, dateStr) {
    return type === 'gym' ? M.gymStatus(dateStr) : M.dietStatus(dateStr);
  }

  function bubbleLabel(type, day, status) {
    var date = M.fmtLong(day.dateStr);
    var s = status === 'done' ? (type === 'gym' ? 'completed' : 'on track')
      : (status === 'missed' || status === 'off') ? (type === 'gym' ? 'missed' : 'off track')
        : M.isFuture(day.dateStr) ? 'upcoming (preview only)' : 'not logged yet';
    var what = type === 'gym' ? day.focus : (day.kind === 'warmup' ? 'warm-up diet log' : 'diet log');
    return day.label + ', ' + date + ', ' + what + ', ' + s;
  }

  function renderTracker(type) {
    var host = document.getElementById(type + '-journey');
    if (!host) return;
    var groups = M.groupByWeek();
    var next = M.nextActionable();
    var frag = document.createDocumentFragment();

    groups.forEach(function (group, gi) {
      var bubbles = h('div', { class: 'gbubbles' });
      var openDayHere = null;

      group.items.forEach(function (day) {
        var isOpen = open[type] === day.dateStr;
        var status = statusOf(type, day.dateStr);
        var cls = 'goli';
        if (status === 'done') cls += ' done';
        else if (status === 'missed' || status === 'off') cls += ' missed';
        else if (day.dateStr === next) cls += ' today';
        if (day.rest) cls += ' rest';
        if (isOpen) { cls += ' selected'; openDayHere = day; }

        var sub = day.kind === 'warmup' ? 'Warm' : day.rest ? 'Rest' : type === 'diet' ? 'Diet' : (day.focus || '').split(' ')[0];
        var badge = status === 'done' ? h('span', { class: 'gbadge', 'aria-hidden': 'true' }, '✓')
          : (status === 'missed' || status === 'off') ? h('span', { class: 'gbadge', 'aria-hidden': 'true' }, '✕') : null;

        var btn = h('button', {
          type: 'button', class: cls,
          id: type + '-bubble-' + day.dateStr,
          'aria-expanded': String(isOpen),
          'aria-controls': isOpen ? type + '-detail-panel' : null,
          'aria-label': bubbleLabel(type, day, status),
          onclick: function () { toggleDay(type, day.dateStr); }
        },
          h('span', { class: 'gdnum', 'aria-hidden': 'true' }, String(day.num)),
          h('span', { class: 'gdsub', 'aria-hidden': 'true' }, sub),
          badge);
        bubbles.appendChild(btn);
      });

      var week = h('section', { class: 'gweek', 'aria-label': group.name },
        h('h3', { class: 'gweek-label' }, group.name,
          group.name.indexOf('Week') === 0 && P.deloadWeeks.indexOf(gi) !== -1
            ? h('span', { class: 'deload-chip' }, 'DELOAD') : null,
          h('span', { class: 'gline', 'aria-hidden': 'true' })),
        bubbles);

      if (openDayHere) week.appendChild(detailPanel(type, openDayHere));
      frag.appendChild(week);
    });

    clear(host).appendChild(frag);
    renderSummary(type);
  }

  // Re-render, then put keyboard focus back on the control the user was on.
  function rerenderKeepFocus(type, focusId) {
    renderTracker(type);
    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) el.focus({ preventScroll: true });
    }
  }

  function toggleDay(type, dateStr) {
    var wasOpen = open[type] === dateStr;
    open[type] = wasOpen ? null : dateStr;
    renderTracker(type);
    if (!wasOpen) {
      var panel = document.getElementById(type + '-detail-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        var heading = panel.querySelector('.gd-title');
        if (heading) heading.focus({ preventScroll: true });
      }
    } else {
      var bubble = document.getElementById(type + '-bubble-' + dateStr);
      if (bubble) bubble.focus({ preventScroll: true });
    }
  }

  function closeBtn(type, dateStr) {
    return h('button', {
      type: 'button', class: 'gclose', 'aria-label': 'Close day details',
      onclick: function () { toggleDay(type, dateStr); }
    }, icon('x'));
  }

  function panelShell(type, day, children) {
    var panel = h('div', {
      class: 'gym-detail', id: type + '-detail-panel', role: 'region',
      'aria-label': day.label + ' details',
      onkeydown: function (e) { if (e.key === 'Escape') toggleDay(type, day.dateStr); }
    },
      closeBtn(type, day.dateStr),
      h('h4', { class: 'gd-title', tabindex: '-1' }, day.label + ' — ' + (type === 'gym' ? day.focus : 'Diet Log')),
      h('div', { class: 'gddate' }, M.fmtLong(day.dateStr) + (M.isFuture(day.dateStr) ? ' · preview' : '')),
      children);
    return panel;
  }

  function futureNote(msg) {
    return h('div', { class: 'gfuture' }, icon('lock'), ' ' + msg);
  }

  /* ================= GYM detail ================= */

  function gymDetail(day) {
    var entry = S.gymEntry(day.dateStr);
    var future = M.isFuture(day.dateStr);
    var kids = [];

    if (day.deload) {
      kids.push(h('div', { class: 'deload-note' },
        icon('info'), ' Deload week: same weights, only 2 sets per exercise, half cardio. Bank the recovery.'));
    }
    if (!day.rest) {
      kids.push(h('details', { class: 'warmup-inline' },
        h('summary', {}, '10-min daily warm-up (asthma-safe — never skip)'),
        h('ul', { class: 'bullet-list' }, P.dailyWarmup.map(function (w) {
          return h('li', {}, w.name + ' — ' + w.meta);
        }))));
    }

    day.exercises.forEach(function (ex) {
      var val = (entry.weights && entry.weights[ex.id]) || '';
      var inputId = 'gwt-' + day.dateStr + '-' + ex.id;
      kids.push(h('div', { class: 'gex' },
        h('div', { class: 'gexinfo' },
          h('span', { class: 'gexname' }, ex.name),
          h('span', { class: 'gexsets' }, ex.sets + (ex.rest ? ' · ' + ex.rest : '')),
          ex.video ? h('a', { class: 'video-link', href: ex.video, target: '_blank', rel: 'noopener noreferrer' }, icon('play'), 'Form') : null),
        ex.weight ? h('div', { class: 'gwt-wrap' },
          h('label', { class: 'sr-only', for: inputId }, 'Weight used for ' + ex.name + ' in kilograms'),
          h('input', {
            type: 'number', class: 'gwt', id: inputId, inputmode: 'decimal',
            min: '0', max: '500', step: '0.5', placeholder: 'kg', value: val,
            disabled: future ? true : null,
            onchange: function (e) {
              var v = e.target.value;
              if (v !== '' && (+v < 0 || +v > 500)) { toast('Weight must be 0–500 kg', 'warn'); e.target.value = val; return; }
              S.setGymWeight(day.dateStr, ex.id, v);
            }
          })) : null));
    });

    if (future) {
      kids.push(futureNote('This day is in the future — preview the plan now, log it when the day arrives.'));
    } else {
      var status = entry.status;
      kids.push(h('div', { class: 'gmark-row' },
        h('button', {
          type: 'button', id: 'gm-done-' + day.dateStr,
          class: 'gmark gdone-btn' + (status === 'done' ? ' active' : ''),
          'aria-pressed': String(status === 'done'),
          onclick: function () { markGym(day, 'done'); }
        }, icon('check'), ' Completed'),
        h('button', {
          type: 'button', id: 'gm-miss-' + day.dateStr,
          class: 'gmark gmiss-btn' + (status === 'missed' ? ' active' : ''),
          'aria-pressed': String(status === 'missed'),
          onclick: function () { markGym(day, 'missed'); }
        }, icon('x'), ' Didn\u2019t Complete')));

      if (status === 'missed') {
        var counter = h('span', {}, String((entry.reason || '').length));
        var reasonId = 'gym-reason-' + day.dateStr;
        kids.push(h('div', { class: 'greason show' },
          h('label', { for: reasonId }, 'Why did you miss it? (helps spot patterns — max 200 chars)'),
          h('textarea', {
            id: reasonId, maxlength: '200', placeholder: 'e.g. Slept late, work emergency, felt unwell\u2026',
            oninput: function (e) {
              counter.textContent = String(e.target.value.length);
              S.setGymReason(day.dateStr, e.target.value);
            }
          }, entry.reason || ''),
          h('div', { class: 'gcc' }, counter, '/200 · saves automatically')));
      }
      kids.push(h('div', { class: 'coach-inline' }, P.healthNotes.asthma));
    }
    return panelShell('gym', day, kids);
  }

  function markGym(day, status) {
    S.setGymStatus(day.dateStr, status);
    announce(day.label + ' marked ' + (status === 'done' ? 'completed' : 'not completed'));
    rerenderKeepFocus('gym', 'gm-' + (status === 'done' ? 'done' : 'miss') + '-' + day.dateStr);
  }

  /* ================= DIET detail ================= */

  function dietDetail(day) {
    var future = M.isFuture(day.dateStr);
    var kids = [];

    if (future) {
      // read-only preview: the plan stays visible (brief §2.6), nothing is toggleable
      var previewPhase = M.wheyPhase(day.dateStr);
      kids.push(futureNote('This day is in the future — you can log meals & water when the day arrives.'));
      kids.push(h('div', { class: 'pts-meter' },
        'Plan for this day — water target ' + P.waterGoal + ' glasses, plus:'));
      P.dietItems.forEach(function (item) {
        var lbl = item.label;
        if (item.phased) lbl += ' — ' + previewPhase.short + (previewPhase.phase === 1 ? ' (Weeks 1-3, liver-safe)' : ' (Week 4+)');
        kids.push(h('div', { class: 'tracker-item preview' },
          h('span', { class: 't-check', 'aria-hidden': 'true' }),
          h('span', { class: 't-label' }, item.icon + ' ' + lbl)));
      });
      return panelShell('diet', day, kids);
    }

    var entry = S.dietEntry(day.dateStr);
    var water = S.water(day.dateStr);
    var pts = M.dietPoints(day.dateStr);
    var phase = M.wheyPhase(day.dateStr);

    kids.push(h('div', { class: 'pts-meter', role: 'status' },
      h('strong', {}, pts.done + ' / ' + pts.total + ' points'),
      ' — ' + pts.need + '+ = on track (water counts as 1 point at ' + P.waterOnTrackMin + '+ glasses)'));

    // water
    var waterRow = h('div', { class: 'water-row', role: 'group', 'aria-label': 'Water glasses, ' + water + ' of ' + P.waterGoal });
    for (var i = 1; i <= P.waterGoal; i++) {
      (function (n) {
        var wgId = 'wg-' + day.dateStr + '-' + n;
        waterRow.appendChild(h('button', {
          type: 'button', id: wgId, class: 'water-glass' + (n <= water ? ' filled' : ''),
          'aria-pressed': String(n <= water),
          'aria-label': 'Glass ' + n + (n <= water ? ', filled' : ', empty'),
          onclick: function () {
            S.setWater(day.dateStr, water === n ? n - 1 : n);
            rerenderKeepFocus('diet', wgId);
          }
        }, '💧'));
      })(i);
    }
    kids.push(h('div', { class: 'water-head' }, icon('water'), ' Water — target ' + P.waterGoal + ' glasses'));
    kids.push(waterRow);
    kids.push(h('div', { class: 'water-count' }, water + ' / ' + P.waterGoal + ' glasses'));

    // checklist
    P.dietItems.forEach(function (item) {
      var checked = !!(entry.checked && entry.checked[item.id]);
      var label = item.label;
      if (item.phased) label += ' — ' + phase.short + (phase.phase === 1 ? ' (Weeks 1-3, liver-safe)' : ' (Week 4+)');
      var ciId = 'ci-' + day.dateStr + '-' + item.id;
      kids.push(h('button', {
        type: 'button', id: ciId, class: 'tracker-item' + (checked ? ' checked' : ''),
        'aria-pressed': String(checked),
        onclick: function () {
          S.toggleDietItem(day.dateStr, item.id);
          rerenderKeepFocus('diet', ciId);
        }
      },
        h('span', { class: 't-check', 'aria-hidden': 'true' }, checked ? '✓' : ''),
        h('span', { class: 't-label' }, item.icon + ' ' + label)));
    });

    // explicit off-track toggle
    var isOff = !!entry.off;
    var offId = 'off-' + day.dateStr;
    kids.push(h('div', { class: 'gmark-row' },
      h('button', {
        type: 'button', id: offId, class: 'gmark gmiss-btn' + (isOff ? ' active' : ''),
        'aria-pressed': String(isOff),
        onclick: function () {
          S.setDietOff(day.dateStr, !isOff);
          announce(day.label + (isOff ? ' off-track cleared' : ' marked off track'));
          rerenderKeepFocus('diet', offId);
        }
      }, icon('x'), isOff ? ' Off Track — tap to clear' : ' Mark Off Track')));

    kids.push(h('div', { class: 'coach-inline' },
      'Day auto-turns 🟢 On Track at ' + pts.need + '+ points. ' + P.healthNotes.liver));

    return panelShell('diet', day, kids);
  }

  /* ================= summary bar ================= */

  function renderSummary(type) {
    var s = M.summary(type);
    var st = M.streak(type);
    var host = document.getElementById(type + '-summary');
    if (!host) return;
    var missLabel = type === 'gym' ? 'Missed' : 'Off Track';
    var doneLabel = type === 'gym' ? 'Done' : 'On Track';
    clear(host);
    host.appendChild(h('div', { class: 'gym-summary' },
      h('div', { class: 'gstat' }, h('div', { class: 'gv gg' }, String(s.done)), h('div', { class: 'gl' }, doneLabel)),
      h('div', { class: 'gstat' }, h('div', { class: 'gv gr' }, String(s.missed)), h('div', { class: 'gl' }, missLabel)),
      h('div', { class: 'gstat' }, h('div', { class: 'gv gb' }, String(s.remaining)), h('div', { class: 'gl' }, 'Remaining')),
      h('div', { class: 'gstat' }, h('div', { class: 'gv go' }, st + 'd'), h('div', { class: 'gl' }, 'Streak'))));
    host.appendChild(h('div', { class: 'ring-row' },
      ring(s.pct, 66, s.pct + '% of all ' + s.total + ' days ' + doneLabel.toLowerCase()),
      h('div', { class: 'ring-cap' },
        h('strong', {}, s.pct + '% complete'),
        h('span', {}, s.done + ' of ' + s.total + ' days ' + doneLabel.toLowerCase()))));
  }

  function detailPanel(type, day) {
    return type === 'gym' ? gymDetail(day) : dietDetail(day);
  }

  // Render and bring today's (or the next actionable) bubble into view — used on tab activation
  // so mid-program the user never has to scroll past weeks of bubbles to find today.
  function activate(type) {
    renderTracker(type);
    var next = M.nextActionable();
    if (!next) return;
    var bubble = document.getElementById(type + '-bubble-' + next);
    if (bubble) bubble.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.TF_TRACKERS = {
    boot: boot,
    render: renderTracker,
    activate: activate
  };
})();
