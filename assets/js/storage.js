/* Tiger Fitness — versioned persistent store (localStorage) with legacy migration. */
(function () {
  'use strict';

  var ROOT_KEY = 'tf_state_v1';
  var LEGACY_RE = {
    gym: /^gym_(\d{4}-\d{2}-\d{2})$/,
    diet: /^diet_(\d{4}-\d{2}-\d{2})$/,
    water: /^water_(\d{4}-\d{2}-\d{2})$/
  };

  function blank() {
    return {
      schema: 1,
      settings: {},          // { warmupStart, programStart, legacyImported }
      gym: {},               // dateStr -> { status:'done'|'missed', reason:'', weights:{exId:val}, legacyWeights:{idx:val} }
      diet: {},              // dateStr -> { off:bool, checked:{itemId:bool} }
      water: {},             // dateStr -> int
      weightLog: {}          // dateStr -> kg (body-weight entries)
    };
  }

  var state = null;
  var saveFailed = false;

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(ROOT_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.schema === 1) {
          state = Object.assign(blank(), parsed);
          return state;
        }
      }
    } catch (e) { /* corrupted/blocked -> start fresh in memory */ }
    state = blank();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(ROOT_KEY, JSON.stringify(state));
      if (saveFailed) { saveFailed = false; emit('tf:save-recovered'); }
      return true;
    } catch (e) {
      if (!saveFailed) { saveFailed = true; emit('tf:save-error', { error: String(e) }); }
      return false;
    }
  }

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) { /* noop */ }
  }

  /* ---- legacy migration (prototype keys: gym_YYYY-MM-DD / diet_ / water_) ---- */

  function scanLegacy() {
    var found = { gym: {}, diet: {}, water: {} };
    var n = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var kind, m;
        for (kind in LEGACY_RE) {
          m = key && key.match(LEGACY_RE[kind]);
          if (m) {
            try {
              found[kind][m[1]] = JSON.parse(localStorage.getItem(key));
              n++;
            } catch (e) { /* skip unparsable */ }
            break;
          }
        }
      }
    } catch (e) { /* storage blocked */ }
    found.count = n;
    return found;
  }

  // resolvePlan(dateStr) -> [{id,...}] | null — supplied by model so weights map index->exercise id.
  function migrateLegacy(resolvePlan) {
    var st = load();
    if (st.settings.legacyImported) return 0;
    var legacy = scanLegacy();
    if (!legacy.count) { st.settings.legacyImported = true; save(); return 0; }

    var imported = 0;
    var dateStr, rec, entry, k, idx, plan;

    for (dateStr in legacy.gym) {
      rec = legacy.gym[dateStr] || {};
      entry = st.gym[dateStr] || { status: '', reason: '', weights: {} };
      if (rec._status === 'done' || rec._status === 'missed') entry.status = entry.status || rec._status;
      if (rec._reason) entry.reason = entry.reason || String(rec._reason).slice(0, 200);
      plan = resolvePlan ? resolvePlan(dateStr) : null;
      for (k in rec) {
        if (k === '_status' || k === '_reason') continue;
        idx = parseInt(k, 10);
        if (isNaN(idx) || !rec[k] || rec[k].weight === undefined || rec[k].weight === '') continue;
        if (plan && plan[idx] && plan[idx].id) {
          if (entry.weights[plan[idx].id] === undefined) entry.weights[plan[idx].id] = String(rec[k].weight);
        } else {
          entry.legacyWeights = entry.legacyWeights || {};
          entry.legacyWeights[idx] = String(rec[k].weight);
        }
      }
      st.gym[dateStr] = entry;
      imported++;
    }

    for (dateStr in legacy.diet) {
      rec = legacy.diet[dateStr] || {};
      entry = st.diet[dateStr] || { off: false, checked: {} };
      if (rec._status === 'off') entry.off = true;
      for (k in rec) {
        if (k === '_status') continue;
        if (rec[k]) entry.checked[k] = true;
      }
      st.diet[dateStr] = entry;
      imported++;
    }

    for (dateStr in legacy.water) {
      var glasses = parseInt(legacy.water[dateStr], 10);
      if (!isNaN(glasses) && st.water[dateStr] === undefined) {
        st.water[dateStr] = Math.max(0, Math.min(12, glasses));
        imported++;
      }
    }

    st.settings.legacyImported = true;
    save();
    return imported;
  }

  /* ---- typed accessors (all save-through) ---- */

  var api = {
    load: load,
    save: save,

    getSettings: function () { return load().settings; },
    setSetting: function (key, val) { load().settings[key] = val; save(); },

    gymEntry: function (dateStr) {
      return load().gym[dateStr] || { status: '', reason: '', weights: {} };
    },
    setGymStatus: function (dateStr, status) {
      var st = load();
      var e = st.gym[dateStr] || { status: '', reason: '', weights: {} };
      e.status = status;
      if (status === 'done') e.reason = '';
      st.gym[dateStr] = e;
      save();
    },
    setGymReason: function (dateStr, reason) {
      var st = load();
      var e = st.gym[dateStr] || { status: '', reason: '', weights: {} };
      e.reason = String(reason || '').slice(0, 200);
      st.gym[dateStr] = e;
      save();
    },
    setGymWeight: function (dateStr, exId, val) {
      var st = load();
      var e = st.gym[dateStr] || { status: '', reason: '', weights: {} };
      e.weights = e.weights || {};
      if (val === '' || val === null) delete e.weights[exId];
      else e.weights[exId] = String(val);
      st.gym[dateStr] = e;
      save();
    },

    dietEntry: function (dateStr) {
      return load().diet[dateStr] || { off: false, checked: {} };
    },
    toggleDietItem: function (dateStr, itemId) {
      var st = load();
      var e = st.diet[dateStr] || { off: false, checked: {} };
      e.checked = e.checked || {};
      e.checked[itemId] = !e.checked[itemId];
      st.diet[dateStr] = e;
      save();
      return e.checked[itemId];
    },
    setDietOff: function (dateStr, off) {
      var st = load();
      var e = st.diet[dateStr] || { off: false, checked: {} };
      e.off = !!off;
      st.diet[dateStr] = e;
      save();
    },
    water: function (dateStr) { return load().water[dateStr] || 0; },
    setWater: function (dateStr, glasses) {
      load().water[dateStr] = Math.max(0, Math.min(12, glasses | 0));
      save();
    },

    weightLog: function () { return load().weightLog; },
    setWeight: function (dateStr, kg) {
      var st = load();
      if (kg === '' || kg === null) delete st.weightLog[dateStr];
      else st.weightLog[dateStr] = Math.round(parseFloat(kg) * 100) / 100;
      save();
    },

    migrateLegacy: migrateLegacy,

    exportJSON: function () {
      return JSON.stringify({ exportedAt: new Date().toISOString(), app: 'tiger-fitness', data: load() }, null, 2);
    },
    importJSON: function (text) {
      var parsed = JSON.parse(text); // throws on invalid JSON
      var data = parsed && parsed.data ? parsed.data : parsed;
      if (!data || data.schema !== 1 || typeof data.gym !== 'object' || typeof data.diet !== 'object') {
        throw new Error('Not a Tiger Fitness backup file');
      }
      state = Object.assign(blank(), data);
      if (!save()) throw new Error('Could not persist imported data');
      return true;
    },
    resetAll: function () {
      state = blank();
      state.settings.legacyImported = true; // don't resurrect old data after explicit reset
      save();
    }
  };

  window.TF_STORE = api;
})();
