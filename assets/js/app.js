/* Tiger Fitness — app shell: boot, tab routing, migration, PWA wiring. */
(function () {
  'use strict';

  var TABS = ['playbook', 'diet', 'gym-log', 'diet-log', 'recipes', 'progress'];
  var TITLES = {
    playbook: ["TIGER'S GYM PLAYBOOK", '90-Day Transformation'],
    diet: ['TIGER & BUJJI DIET PLAN', 'Same food, different portions'],
    'gym-log': ['GYM TRACKER', 'Tap a bubble — mark it, log your weights'],
    'diet-log': ['DIET TRACKER', 'Meals + water — 80% turns the day green'],
    recipes: ['FAT-LOSS KITCHEN', '300 recipes · 15 categories · Tiger & Bujji portions'],
    progress: ['PROGRESS & SETTINGS', 'Weigh-ins, milestones, backups']
  };
  var current = '';

  function boot() {
    window.TF_TRACKERS.boot();
    window.TF_RECIPES_VIEW.boot();
    window.TF_PROGRESS.boot();

    // one-time migration of prototype localStorage data (index-keyed weights -> exercise ids)
    var imported = window.TF_STORE.migrateLegacy(window.TF_MODEL.legacyPlanFor);
    if (imported > 0) {
      window.TF_UI.toast('Imported ' + imported + ' day(s) of data from the old tracker 🐯');
    }

    window.TF_REFERENCE.boot();

    document.querySelectorAll('.nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { show(btn.dataset.tab, true); });
    });

    document.addEventListener('tf:save-error', function () {
      window.TF_UI.toast('Could not save — storage is full or blocked. Export a backup!', 'warn');
    });
    document.addEventListener('tf:dates-changed', function () {
      window.TF_TRACKERS.render('gym');
      window.TF_TRACKERS.render('diet');
    });

    var fromHash = (location.hash || '').replace('#/', '');
    show(TABS.indexOf(fromHash) !== -1 ? fromHash : 'playbook', false);

    window.addEventListener('hashchange', function () {
      var tab = (location.hash || '').replace('#/', '');
      if (TABS.indexOf(tab) !== -1 && tab !== current) show(tab, false);
    });

    registerSW();
    wireInstallPrompt();
  }

  function show(tab, pushHash) {
    if (TABS.indexOf(tab) === -1) tab = 'playbook';
    current = tab;
    TABS.forEach(function (t) {
      var panel = document.getElementById('tab-' + t);
      var btn = document.querySelector('.nav-btn[data-tab="' + t + '"]');
      var active = t === tab;
      if (panel) panel.hidden = !active;
      if (btn) {
        btn.classList.toggle('active', active);
        if (active) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
      }
    });
    var head = TITLES[tab];
    document.getElementById('page-title').textContent = head[0];
    document.getElementById('page-subtitle').textContent = head[1];

    window.scrollTo({ top: 0 });

    if (tab === 'gym-log') window.TF_TRACKERS.activate('gym');
    if (tab === 'diet-log') window.TF_TRACKERS.activate('diet');
    if (tab === 'recipes') window.TF_RECIPES_VIEW.activate();
    if (tab === 'progress') window.TF_PROGRESS.activate();

    if (pushHash) {
      try { history.replaceState(null, '', '#/' + tab); } catch (e) { location.hash = '#/' + tab; }
    }
  }

  /* ---------------- PWA ---------------- */

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function () {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBar(reg);
          }
        });
      });
    }).catch(function () { /* SW is progressive enhancement */ });
  }

  function showUpdateBar(reg) {
    var bar = document.getElementById('update-bar');
    if (!bar) return;
    bar.hidden = false;
    document.getElementById('update-btn').onclick = function () {
      // reload only once the new worker actually controls the page (no timer race)
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        location.reload();
      }, { once: true });
      if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
      else location.reload();
    };
  }

  var deferredPrompt = null;
  function wireInstallPrompt() {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      var btn = document.getElementById('install-btn');
      if (!btn) return;
      btn.hidden = false;
      btn.onclick = function () {
        btn.hidden = true;
        deferredPrompt.prompt();
        deferredPrompt = null;
      };
    });
    window.addEventListener('appinstalled', function () {
      window.TF_UI.toast('Installed! Find Tiger Fitness on your home screen 🐯🔥');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
