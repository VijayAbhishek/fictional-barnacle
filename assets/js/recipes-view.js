/* Tiger Fitness — cookbook browser: 300 recipes, search, filters, detail view. */
(function () {
  'use strict';

  var h, icon, clear, table, toast;
  var loaded = false, loading = false;
  var state = { q: '', cat: 0, diet: '', tier: '', maxKcal: 0, sort: 'id', openId: null };
  var listEl, detailEl, countEl;

  function boot() {
    var ui = window.TF_UI;
    h = ui.h; icon = ui.icon; clear = ui.clear; table = ui.table; toast = ui.toast;
  }

  function ensureData(cb) {
    if (loaded || window.TF_RECIPES) { loaded = true; cb(); return; }
    if (loading) return;
    loading = true;
    var host = document.getElementById('recipes-content');
    if (host) {
      clear(host).appendChild(h('div', { class: 'card center' }, 'Loading 300 recipes…'));
    }
    var s = document.createElement('script');
    s.src = 'data/recipes.js';
    s.onload = function () { loaded = true; loading = false; cb(); };
    s.onerror = function () {
      loading = false;
      s.remove();
      if (host) {
        clear(host).appendChild(h('div', { class: 'card center' },
          h('p', { class: 'lead' }, 'Could not load the cookbook data (data/recipes.js).'),
          h('button', { type: 'button', class: 'gmark gdone-btn', onclick: activate }, 'Try again')));
      }
    };
    document.head.appendChild(s);
  }

  function activate() {
    ensureData(function () {
      renderShell();
      // keep an open recipe open across tab switches
      if (state.openId) openDetail(state.openId);
      else applyFilters();
    });
  }

  /* -------------- filter logic -------------- */

  function difficultyBand(text) {
    var t = (text || '').toLowerCase();
    if (t.indexOf('easy') !== -1) return 'easy';
    if (t.indexOf('medium') !== -1) return 'medium';
    if (t.indexOf('advanced') !== -1 || t.indexOf('hard') !== -1) return 'advanced';
    return '';
  }
  function tierBand(text) {
    var m = (text || '').match(/\b([ABC])\b/);
    return m ? m[1] : '';
  }

  function matches(r) {
    if (state.cat && r.category !== state.cat) return false;
    if (state.diet && r.diet !== state.diet) return false;
    if (state.tier && tierBand(r.tier) !== state.tier) return false;
    if (state.maxKcal && (!r.nutrition.kcal || r.nutrition.kcal > state.maxKcal)) return false;
    if (state.q) {
      var q = state.q.toLowerCase();
      var hay = r.id.toLowerCase() + ' ' + r.name.toLowerCase() + ' ' +
        r.ingredients.map(function (i) { return i.name.toLowerCase(); }).join(' ');
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function applyFilters() {
    var D = window.TF_RECIPES;
    var rs = D.recipes.filter(matches);
    if (state.sort === 'kcal') rs.sort(function (a, b) { return (a.nutrition.kcal || 9e9) - (b.nutrition.kcal || 9e9); });
    else if (state.sort === 'protein') rs.sort(function (a, b) { return (b.nutrition.proteinG || 0) - (a.nutrition.proteinG || 0); });
    else if (state.sort === 'name') rs.sort(function (a, b) { return a.name.localeCompare(b.name); });
    renderList(rs);
  }

  /* -------------- shell -------------- */

  function renderShell() {
    var host = document.getElementById('recipes-content');
    if (!host || host.dataset.built) { return; }
    host.dataset.built = '1';
    var D = window.TF_RECIPES;

    var searchId = 'recipe-search';
    var controls = h('div', { class: 'recipe-controls card' },
      h('div', { class: 'search-row' },
        icon('search'),
        h('label', { class: 'sr-only', for: searchId }, 'Search recipes by name or ingredient'),
        h('input', {
          type: 'search', id: searchId, placeholder: 'Search 300 recipes… (name or ingredient)',
          oninput: debounce(function (e) { state.q = e.target.value.trim(); applyFilters(); }, 150)
        }),
        h('button', {
          type: 'button', class: 'dice-btn', title: 'Surprise me', 'aria-label': 'Pick a random recipe',
          onclick: function () {
            var pool = D.recipes.filter(matches);
            if (!pool.length) pool = D.recipes;
            openDetail(pool[Math.floor(Math.random() * pool.length)].id);
          }
        }, icon('dice'))),
      h('div', { class: 'filter-row' },
        select('Category', [['0', 'All categories']].concat(D.categories.map(function (c) {
          return [String(c.num), c.name];
        })), function (v) { state.cat = +v; applyFilters(); }),
        select('Diet', [['', 'Veg + Egg + Non-Veg'], ['veg', 'Pure Veg'], ['egg', 'Egg'], ['nonveg', 'Non-Veg']],
          function (v) { state.diet = v; applyFilters(); }),
        select('Fat-loss tier', [['', 'Any tier'], ['A', 'Tier A — eat freely'], ['B', 'Tier B — moderate'], ['C', 'Tier C — occasional']],
          function (v) { state.tier = v; applyFilters(); }),
        select('Max calories', [['0', 'Any kcal'], ['150', '≤ 150 kcal'], ['250', '≤ 250 kcal'], ['350', '≤ 350 kcal']],
          function (v) { state.maxKcal = +v; applyFilters(); }),
        select('Sort', [['id', 'Book order'], ['name', 'Name A-Z'], ['kcal', 'Calories ↑'], ['protein', 'Protein ↓']],
          function (v) { state.sort = v; applyFilters(); })));

    countEl = h('p', { class: 'recipe-count', role: 'status' });
    listEl = h('div', { class: 'recipe-list' });
    detailEl = h('div', {});
    clear(host);
    host.appendChild(controls);
    host.appendChild(countEl);
    host.appendChild(listEl);
    host.appendChild(detailEl);
  }

  function select(label, options, onchange) {
    var sel = h('select', {
      'aria-label': label,
      onchange: function (e) { onchange(e.target.value); }
    }, options.map(function (o) { return h('option', { value: o[0] }, o[1]); }));
    return h('span', { class: 'sel-wrap' }, sel);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  /* -------------- list -------------- */

  function catName(num) {
    var D = window.TF_RECIPES;
    for (var i = 0; i < D.categories.length; i++) if (D.categories[i].num === num) return D.categories[i].name;
    return '';
  }

  var DIET_BADGE = { veg: ['V', 'b-veg', 'Pure veg'], egg: ['E', 'b-egg', 'Contains egg'], nonveg: ['N', 'b-nonveg', 'Non-veg'] };

  function renderList(rs) {
    countEl.textContent = rs.length + ' of ' + window.TF_RECIPES.recipes.length + ' recipes';
    var frag = document.createDocumentFragment();
    rs.slice(0, 400).forEach(function (r) {
      var badge = DIET_BADGE[r.diet] || DIET_BADGE.veg;
      var tier = tierBand(r.tier);
      frag.appendChild(h('button', {
        type: 'button', class: 'recipe-card', id: 'rcard-' + r.id,
        onclick: function () { openDetail(r.id); }
      },
        h('div', { class: 'rc-top' },
          h('span', { class: 'rc-id' }, r.id),
          h('span', { class: 'rc-badge ' + badge[1], title: badge[2], 'aria-label': badge[2] }, badge[0]),
          tier ? h('span', { class: 'rc-tier t-' + tier }, tier) : null),
        h('div', { class: 'rc-name' }, r.name),
        h('div', { class: 'rc-meta' },
          (r.nutrition.calories ? r.nutrition.calories : '—') + ' · ' +
          (r.nutrition.protein ? r.nutrition.protein + ' protein' : '') ),
        h('div', { class: 'rc-cat' }, catName(r.category))));
    });
    clear(listEl).appendChild(frag);
    listEl.hidden = false;
    clear(detailEl);
  }

  /* -------------- detail -------------- */

  function openDetail(id) {
    var D = window.TF_RECIPES;
    var r = null;
    for (var i = 0; i < D.recipes.length; i++) if (D.recipes[i].id === id) { r = D.recipes[i]; break; }
    if (!r) return;
    state.openId = id;
    listEl.hidden = true;

    var kids = [];
    kids.push(h('button', { type: 'button', class: 'back-btn', onclick: function () { closeDetail(); } },
      icon('back'), ' All recipes'));

    var badge = DIET_BADGE[r.diet] || DIET_BADGE.veg;
    kids.push(h('div', { class: 'recipe-hero card' },
      h('div', { class: 'rc-top' },
        h('span', { class: 'rc-id' }, r.id),
        h('span', { class: 'rc-badge ' + badge[1] }, badge[2]),
        h('span', { class: 'rc-cat' }, catName(r.category))),
      h('h3', { class: 'recipe-title', tabindex: '-1', id: 'recipe-title' }, r.name),
      r.tagline ? h('p', { class: 'recipe-tagline' }, '“' + r.tagline + '”') : null,
      h('div', { class: 'chip-row' },
        r.difficulty ? chip(r.difficulty) : null,
        r.prepTime ? chip('Prep: ' + r.prepTime) : null,
        r.cookTime ? chip('Cook: ' + r.cookTime) : null,
        r.tier ? chip('Tier ' + r.tier) : null),
      (r.servings.tiger || r.servings.bujji) ? h('div', { class: 'portion-line' },
        r.servings.tiger ? h('span', { class: 'portion-tag portion-tiger' }, '🐯 ' + r.servings.tiger) : null,
        r.servings.bujji ? h('span', { class: 'portion-tag portion-bujji' }, '🌸 ' + r.servings.bujji) : null) : null,
      r.equipment ? h('p', { class: 'lead' }, 'Equipment: ' + r.equipment) : null));

    if (r.ingredients.length) {
      var hasB = r.ingredients.some(function (x) { return x.bujjiQty; });
      var head = hasB ? ['Ingredient', 'Tiger', 'Bujji', 'Practical'] : ['Ingredient', 'Quantity', 'Practical'];
      var rows = r.ingredients.map(function (x) {
        return hasB ? [x.name, x.qty, x.bujjiQty, x.practical] : [x.name, x.qty, x.practical];
      });
      kids.push(section('Ingredients', table(head, rows)));
    }
    if (r.method.length) {
      kids.push(section('Cooking Method', table(['Stage', 'Equipment', 'Mode', 'Temp', 'Time'],
        r.method.map(function (m) { return [m.stage, m.equipment, m.mode, m.temp, m.time]; }))));
    }
    if (r.stovetop) kids.push(section('🔥 Stove-Top Alternative', h('p', { class: 'lead' }, r.stovetop)));
    if (r.steps.length) {
      kids.push(section('Step-by-Step', h('ol', { class: 'step-list' },
        r.steps.map(function (s) { return h('li', {}, s); }))));
    }
    if (r.nutrition.calories || r.nutrition.protein) {
      var nrows = [];
      if (r.nutrition.calories) nrows.push(['Calories', r.nutrition.calories]);
      if (r.nutrition.protein) nrows.push(['Protein', r.nutrition.protein]);
      if (r.nutrition.carbs) nrows.push(['Carbs', r.nutrition.carbs]);
      if (r.nutrition.fat) nrows.push(['Fat', r.nutrition.fat]);
      if (r.nutrition.fiber) nrows.push(['Fiber', r.nutrition.fiber]);
      if (r.nutrition.hunger) nrows.push(['Hunger Control', r.nutrition.hunger]);
      kids.push(section('Nutrition' + (r.nutritionNote ? ' (' + r.nutritionNote + ')' : ''),
        table(['Nutrient', 'Amount'], nrows, { rowHeader: true })));
    }
    if (r.flavors.length) {
      kids.push(section('Flavor Profile', h('div', { class: 'chip-row' }, r.flavors.map(chip))));
    }
    if (r.mistakes.length) kids.push(section('Common Mistakes', numList(r.mistakes)));
    if (r.notes.length) kids.push(section('Tiger Notes 🐯', ulList(r.notes)));
    if (r.bujji.length) {
      kids.push(h('div', { class: 'card bujji-card' },
        h('h4', { class: 'section-title' }, 'Bujji Version 🌸'),
        r.bujji.map(function (b) { return h('p', { class: 'lead' }, b); })));
    }
    if (r.batchPrep.length) kids.push(section('Batch Prep Notes', ulList(r.batchPrep)));

    clear(detailEl);
    detailEl.appendChild(h('div', { class: 'recipe-detail' }, kids));
    var t = document.getElementById('recipe-title');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (t) t.focus({ preventScroll: true });
  }

  function closeDetail() {
    var lastId = state.openId;
    state.openId = null;
    clear(detailEl);
    listEl.hidden = false;
    // return focus to the card that was opened (falls back to the search box)
    var card = lastId && document.getElementById('rcard-' + lastId);
    if (card) { card.scrollIntoView({ block: 'center' }); card.focus({ preventScroll: true }); }
    else {
      var search = document.getElementById('recipe-search');
      if (search) search.focus();
    }
  }

  function chip(text) { return h('span', { class: 'chip' }, text); }
  function section(titleText, body) {
    return h('div', { class: 'card' }, h('h4', { class: 'section-title' }, titleText), body);
  }
  function numList(items) {
    return h('ol', { class: 'step-list' }, items.map(function (t) { return h('li', {}, t); }));
  }
  function ulList(items) {
    return h('ul', { class: 'bullet-list' }, items.map(function (t) { return h('li', {}, t); }));
  }

  window.TF_RECIPES_VIEW = { boot: boot, activate: activate };
})();
