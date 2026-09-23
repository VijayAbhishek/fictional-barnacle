/* Tiger Fitness — domain model: journey, statuses, points, streaks (all dates LOCAL). */
(function () {
  'use strict';

  var P = function () { return window.TF_PROGRAM; };
  var S = function () { return window.TF_STORE; };

  /* ---------- date helpers (local timezone, never toISOString) ---------- */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromStr(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function addDays(dateStr, n) {
    var d = fromStr(dateStr);
    d.setDate(d.getDate() + n);
    return toStr(d);
  }
  function todayStr() { return toStr(new Date()); }
  var WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var WD_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function weekdayName(dateStr) { return WD[fromStr(dateStr).getDay()]; }
  function fmtLong(dateStr) {
    var d = fromStr(dateStr);
    return WD_ABBR[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  /* ---------- settings ---------- */

  function isDateStr(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(fromStr(s).getTime()); }

  function settings() {
    var st = S().getSettings();
    var d = P().defaults;
    var warmupStart = isDateStr(st.warmupStart) ? st.warmupStart : d.warmupStart;
    var programStart = isDateStr(st.programStart) ? st.programStart : d.programStart;
    // Day 1 may never fall inside the warm-up window (would duplicate dates in the journey).
    var earliest = addDays(warmupStart, P().meta.warmupDays);
    if (programStart < earliest) programStart = earliest;
    return { warmupStart: warmupStart, programStart: programStart };
  }

  /* ---------- journey ---------- */

  var _journey = null;
  var _journeyKey = '';

  function buildJourney() {
    var cfg = settings();
    var key = cfg.warmupStart + '|' + cfg.programStart;
    if (_journey && _journeyKey === key) return _journey;

    var prog = P();
    var days = [];
    var i, dateStr, tpl, wd;

    for (i = 0; i < prog.meta.warmupDays; i++) {
      dateStr = addDays(cfg.warmupStart, i);
      tpl = prog.warmupTemplates[i] || prog.warmupTemplates[prog.warmupTemplates.length - 1];
      days.push({
        dateStr: dateStr, kind: 'warmup', num: 'W' + (i + 1), label: tpl.label,
        focus: tpl.focus, rest: false, week: 0, exercises: resolvePlan(dateStr, tpl.exercises)
      });
    }
    for (i = 1; i <= prog.meta.programDays; i++) {
      dateStr = addDays(cfg.programStart, i - 1);
      wd = weekdayName(dateStr);
      var week = Math.ceil(i / 7);
      days.push({
        dateStr: dateStr, kind: 'program', num: i, label: 'Day-' + i,
        focus: prog.focus[wd], rest: wd === 'Friday', week: week,
        deload: prog.deloadWeeks.indexOf(week) !== -1,
        exercises: resolvePlan(dateStr, prog.weeklyPlan[wd] || [])
      });
    }
    _journey = days;
    _journeyKey = key;
    return days;
  }

  // Date-specific overrides beat the default plan for ANY date.
  function resolvePlan(dateStr, fallback) {
    var ov = P().dateOverrides[dateStr];
    return (ov && ov.exercises) ? ov.exercises : (fallback || []);
  }

  // Resolve the plan a LEGACY record's numeric indexes refer to (same order as prototype).
  function legacyPlanFor(dateStr) {
    var cfg = settings();
    var prog = P();
    var i;
    for (i = 0; i < prog.meta.warmupDays; i++) {
      if (addDays(cfg.warmupStart, i) === dateStr) return prog.warmupTemplates[i].exercises;
    }
    return prog.weeklyPlan[weekdayName(dateStr)] || [];
  }

  function invalidate() { _journey = null; }

  function findDay(dateStr) {
    var j = buildJourney();
    for (var i = 0; i < j.length; i++) if (j[i].dateStr === dateStr) return j[i];
    return null;
  }

  function groupByWeek() {
    var j = buildJourney();
    var prog = P();
    var groups = [{ name: '🔥 Warm-Up Week', items: j.slice(0, prog.meta.warmupDays) }];
    var rest = j.slice(prog.meta.warmupDays);
    for (var w = 0; w * 7 < rest.length; w++) {
      groups.push({ name: 'Week ' + (w + 1), items: rest.slice(w * 7, w * 7 + 7) });
    }
    return groups;
  }

  /* ---------- program week / whey phase ---------- */

  function programWeekOf(dateStr) {
    var cfg = settings();
    if (dateStr < cfg.programStart) return 0; // warm-up
    var diff = Math.round((fromStr(dateStr) - fromStr(cfg.programStart)) / 86400000);
    return Math.floor(diff / 7) + 1;
  }

  function wheyPhase(dateStr) {
    var week = programWeekOf(dateStr);
    return week >= 4
      ? { phase: 2, label: 'FULL scoop (35g) + 5g creatine', short: 'full scoop' }
      : { phase: 1, label: 'HALF scoop (17g) + 5g creatine', short: 'half scoop' };
  }

  /* ---------- gym status ---------- */

  function gymStatus(dateStr) { return S().gymEntry(dateStr).status || ''; }

  /* ---------- diet points ---------- */

  function dietPoints(dateStr) {
    var prog = P();
    var entry = S().dietEntry(dateStr);
    var checked = entry.checked || {};
    var done = 0;
    for (var i = 0; i < prog.dietItems.length; i++) {
      if (checked[prog.dietItems[i].id]) done++;
    }
    var waterOk = S().water(dateStr) >= prog.waterOnTrackMin;
    var total = prog.dietItems.length + 1;
    return {
      done: done + (waterOk ? 1 : 0),
      total: total,
      need: Math.ceil(total * prog.onTrackRatio),
      waterOk: waterOk
    };
  }

  // '' (nothing yet) | 'done' (on track) | 'off' (explicitly off track)
  function dietStatus(dateStr) {
    if (S().dietEntry(dateStr).off) return 'off';
    var pts = dietPoints(dateStr);
    return pts.done >= pts.need ? 'done' : '';
  }

  /* ---------- summaries / streaks / next-day ---------- */

  function summary(type) {
    var j = buildJourney();
    var done = 0, missed = 0;
    for (var i = 0; i < j.length; i++) {
      var s = type === 'gym' ? gymStatus(j[i].dateStr) : dietStatus(j[i].dateStr);
      if (s === 'done') done++;
      else if (s === 'missed' || s === 'off') missed++;
    }
    return {
      done: done, missed: missed, remaining: j.length - done - missed,
      total: j.length, pct: Math.round((done / j.length) * 100)
    };
  }

  // Consecutive success ending at today (unlogged TODAY doesn't break; unmarked REST days are skipped).
  function streak(type) {
    var j = buildJourney();
    var today = todayStr();
    var count = 0;
    for (var i = j.length - 1; i >= 0; i--) {
      var day = j[i];
      if (day.dateStr > today) continue;
      var s = type === 'gym' ? gymStatus(day.dateStr) : dietStatus(day.dateStr);
      if (s === 'done') { count++; continue; }
      if (day.dateStr === today) continue;            // today not logged yet — grace
      if (type === 'gym' && day.rest && s === '') continue; // unmarked rest day — neutral
      break;
    }
    return count;
  }

  // Today if inside the journey; the next upcoming journey day before it starts or during a
  // warm-up→program gap; null when the journey is finished.
  function nextActionable() {
    var j = buildJourney();
    var today = todayStr();
    if (today > j[j.length - 1].dateStr) return null;
    if (findDay(today)) return today;
    for (var i = 0; i < j.length; i++) {
      if (j[i].dateStr > today) return j[i].dateStr;
    }
    return null;
  }

  function isFuture(dateStr) { return dateStr > todayStr(); }

  /* ---------- exports ---------- */

  window.TF_MODEL = {
    todayStr: todayStr,
    fmtLong: fmtLong,
    addDays: addDays,
    isDateStr: isDateStr,
    weekdayName: weekdayName,
    settings: settings,
    invalidate: invalidate,
    journey: buildJourney,
    groupByWeek: groupByWeek,
    findDay: findDay,
    legacyPlanFor: legacyPlanFor,
    programWeekOf: programWeekOf,
    wheyPhase: wheyPhase,
    gymStatus: gymStatus,
    dietPoints: dietPoints,
    dietStatus: dietStatus,
    summary: summary,
    streak: streak,
    nextActionable: nextActionable,
    isFuture: isFuture
  };
})();
