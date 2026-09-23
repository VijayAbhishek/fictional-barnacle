/* Tiger Fitness — reference tabs: Gym Playbook & Diet Plan (rendered from data modules). */
(function () {
  'use strict';

  var h, table, clear, icon;
  var P, N;

  function boot() {
    var ui = window.TF_UI;
    h = ui.h; table = ui.table; clear = ui.clear; icon = ui.icon;
    P = window.TF_PROGRAM; N = window.TF_NUTRITION;
    renderPlaybook();
    renderDiet();
  }

  function banner(text) { return h('div', { class: 'section-banner' }, text); }
  function coach(text, label) {
    return h('div', { class: 'coach-says' },
      h('div', { class: 'coach-label' }, label || 'Coach Says:'),
      h('div', { class: 'coach-text' }, text));
  }
  function quote(text) { return h('div', { class: 'quote-line' }, text); }
  function card() {
    var node = h('div', { class: 'card' });
    for (var i = 0; i < arguments.length; i++) window.TF_UI.append(node, arguments[i]);
    return node;
  }
  function title(text) { return h('div', { class: 'section-title' }, text); }
  function bullets(items) {
    return h('ul', { class: 'bullet-list' }, items.map(function (t) { return h('li', {}, t); }));
  }

  /* ================= GYM PLAYBOOK ================= */

  function dayCard(name, focusText, exercises, note, quoteText, extra) {
    var body = h('div', { class: 'day-body' });
    if (extra) body.appendChild(extra);
    exercises.forEach(function (ex, i) {
      body.appendChild(h('div', { class: 'exercise' },
        h('span', { class: 'num', 'aria-hidden': 'true' }, String(i + 1)),
        h('div', { class: 'details' },
          h('div', { class: 'name' }, ex.name),
          h('div', { class: 'meta' }, ex.sets + (ex.rest ? ' | Rest ' + ex.rest : ''))),
        ex.video ? h('a', { class: 'video-link', href: ex.video, target: '_blank', rel: 'noopener noreferrer' }, 'Form ↗') : null));
    });
    if (note) body.appendChild(coach(note));
    var wrap = h('article', { class: 'day-card' },
      h('div', { class: 'day-header' }, h('span', {}, name), h('span', { class: 'tag' }, focusText)),
      body);
    return quoteText ? [wrap, quote(quoteText)] : wrap;
  }

  function renderPlaybook() {
    var host = document.getElementById('playbook-content');
    if (!host) return;
    var frag = document.createDocumentFragment();
    var add = function (n) { window.TF_UI.append(frag, n); };

    add(h('div', { class: 'stats-grid' }, [
      ['107.15 kg', 'Start Weight'], [P.meta.targetKg + ' kg', 'Target'],
      ['90 days', 'Timeline'], [P.meta.ratePerWeek, 'Rate']
    ].map(function (s) {
      return h('div', { class: 'stat-tile' }, h('div', { class: 'val' }, s[0]), h('div', { class: 'label' }, s[1]));
    })));

    add(banner('TRAINING PHILOSOPHY'));
    add(card(title('WHY THIS PLAN WORKS:'), bullets([
      '6 days training = maximum calorie burn while still recovering',
      'Compound movements FIRST = more muscles worked = more calories per exercise',
      'Progressive overload = muscles MUST grow stronger week by week',
      'HIIT cardio on BIKE = maximum fat burn WITHOUT triggering asthma',
      'Friday REST = body rebuilds, comes back stronger Saturday',
      'Sunday BONUS = cardio + core + weak points = your secret weapon'
    ])));
    add(card(title('NON-NEGOTIABLE RULES:'), bullets([
      'FORM > EGO. Always. Light weight + perfect form beats heavy weight + bad form.',
      'Never skip warm-up. Joints at 107 kg need preparation.',
      'Inhaler in gym bag. ALWAYS.',
      'Dizzy / chest tight / wheezing = STOP. Rest. Inhaler. Resume when clear.',
      'Track weights in the Gym Log. What gets measured gets managed.'
    ])));
    add(coach('Tiger, nee weight 107 kg undi. Ee weight tho gym lo unnapudu, nee joints ki already stress ekkuva. Form first, weight second. First 2 weeks light weights tho perfect form nerchuko. Week 3 onwards we push harder. Patience now = results later. 🐻'));

    add(banner('WEEKLY BATTLE PLAN'));
    add(card(table(['Day', 'Focus', 'Cardio', 'Time'], [
      ['MON', 'Chest + Shoulders + HIIT', '15-min Bike HIIT', '~75 min'],
      ['TUE', 'Back + Biceps + Core', '15-min Steady Bike', '~75 min'],
      ['WED', 'Legs (HEAVY) + Cardio', '10-min Stair Climber', '~80 min'],
      ['THU', 'Shoulders + Arms (Supersets)', '15-min Bike HIIT', '~70 min'],
      ['FRI', 'REST DAY', 'Walk with Arjun & Arya', '30-60 min'],
      ['SAT', 'Full Body + Cardio Finisher', '20-min Mixed', '~85 min'],
      ['SUN', 'BONUS: Cardio + Core + Weak Points', '~25-min LISS mix', '~65 min']
    ], { rowHeader: true })));
    add(coach('Friday rest day enti ante: Work week end lo body recover avutundi, Saturday fresh ga full body attack cheyochu, Sunday BONUS day ki energy untundi. Most people Sunday rest — you ATTACK. That\'s your edge, Tiger. 🐻'));
    add(quote(P.quotes.Sunday));

    add(banner('DAILY WARM-UP (10 MIN — EVERY SESSION)'));
    add(card(
      h('p', { class: 'lead' }, 'Same every day. No thinking. Just start.'),
      table(['Exercise', 'Duration', 'Purpose'], P.dailyWarmup.map(function (w) {
        var parts = w.meta.split('—');
        return [w.name, parts[0].trim(), (parts[1] || '').trim()];
      }))));
    add(coach(P.healthNotes.asthma));

    add(banner('WARM-UP WEEK — EASE IN BEFORE DAY 1'));
    add(card(
      h('p', { class: 'lead' }, '4 easy days to learn the machines, groove the movements, and prep your body. NO ego lifting. Dates are configurable in Settings — the full 90-day program starts the Monday after.'),
      table(['Day', 'Focus', 'Time', 'Intensity'], P.warmupTemplates.map(function (t) {
        return [t.label, t.focus, t.time, t.intensity];
      }))));
    add(dayCard('WARM-UP DAY-1 & DAY-3', 'Machine Circuit — 2 sets × 12, light',
      P.warmupTemplates[0].exercises, null, null));
    add(dayCard('WARM-UP DAY-2 & DAY-4', 'Active Recovery — walk / bike / stretch',
      P.warmupTemplates[1].exercises.concat(P.warmupTemplates[3].exercises), P.coachNotes.warmup, null));

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(function (wd) {
      var extra = null;
      if (wd === 'Thursday') {
        extra = h('div', { class: 'form-cue' }, 'WHAT IS A SUPERSET? Do Exercise A immediately followed by Exercise B. No rest between A and B. Rest only AFTER completing both. This keeps heart rate high = more fat burned.');
      }
      if (wd === 'Sunday') {
        extra = h('div', { class: 'form-cue' }, 'This day is OPTIONAL but recommended. Skip if exhausted — listen to your body.');
      }
      if (wd === 'Friday') {
        add(h('article', { class: 'day-card' },
          h('div', { class: 'day-header' }, h('span', {}, 'FRIDAY'), h('span', { class: 'tag' }, 'REST & RECOVERY')),
          h('div', { class: 'day-body' },
            h('div', { class: 'do-dont' },
              h('div', { class: 'do-box' }, h('h4', {}, 'DO:'), bullets([
                'Walk with Arjun & Arya (30-60 min)',
                'Stretch for 10-15 min (hamstrings, hip flexors, shoulders)',
                'Drink 3-4 litres water',
                'Sleep 7+ hours',
                'Hit your protein target — rest day doesn\'t mean diet day off'
              ])),
              h('div', { class: 'dont-box' }, h('h4', {}, 'DON\'T:'), bullets([
                'Don\'t go to the gym "just for a little bit" — your body needs this day',
                'Don\'t eat junk because "it\'s rest day" — protein stays the same',
                'Don\'t feel guilty. Rest = growth. Muscles grow during recovery, not during training.'
              ]))),
            coach(P.coachNotes.Friday))));
        add(quote(P.quotes.Friday));
        return;
      }
      add(dayCard(wd.toUpperCase(), P.focus[wd] + (wd === 'Monday' || wd === 'Thursday' ? ' + HIIT' : ''),
        P.weeklyPlan[wd], P.coachNotes[wd], P.quotes[wd], extra));
    });

    add(banner('HOW TO PICK YOUR STARTING WEIGHT'));
    add(card(
      title('WEEK 1 = DISCOVERY WEEK'),
      h('p', { class: 'lead' }, 'Your only job in Week 1 is to find YOUR weights for each exercise. Not to set records. Not to impress anyone.'),
      title('THE 12-REP METHOD:'),
      bullets([
        'Step 1: Pick a weight that feels "too easy" (seriously, lighter than you think)',
        'Step 2: Do 12 reps with PERFECT form',
        'Step 3: Ask yourself — how did reps 11 and 12 feel?'
      ]),
      table(['How it felt', 'What to do', 'Example'], [
        ['"I could do 20 more reps"', 'Too light — go UP 2.5-5 kg', 'Chest press at 10 kg? Try 15 kg'],
        ['"Reps 11-12 burned but form was good"', 'PERFECT — lock it in. Start here.', 'This is your weight'],
        ['"Couldn\'t finish 12 / form broke"', 'Too heavy — go DOWN 2.5-5 kg', 'Squat at 40 kg? Try 30 kg']
      ])));
    add(card(title('WHEN TO INCREASE (After Week 1):'), bullets([
      'All sets completed with good form and the last 2 reps aren\'t challenging → increase 2.5-5 kg next session',
      'Increase every 2-3 weeks (not every session)',
      'Some exercises progress faster (leg press) than others (lateral raises) — that\'s normal'
    ])));
    add(coach('EGO LIFTING is the #1 injury cause for beginners. Nee gym lo andarini chustav — heavy weights vestuntaru. Vaalla journey different, nee journey different. 107 kg tho nuvvu light weights tho start chesthe, NOBODY is judging you. But if you get injured, you lose weeks. Form > Ego. ALWAYS. 🐻'));
    add(quote('"The weight doesn\'t know how much it weighs. YOUR MUSCLES DO." 💪'));

    add(banner('CARDIO STRATEGY'));
    add(card(title('ASTHMA-SAFE CARDIO RULES:'), bullets([
      'ALL cardio is INDOORS (no outdoor running — dust/pollen trigger)',
      'Primary: Stationary Bike (controlled breathing, no impact)',
      'Secondary: Incline Treadmill Walk (low intensity, airways stay open)',
      'HIIT format: Bike only (30s sprint / 30s rest — if breathing gets tight, extend rest to 45s)',
      'Keep inhaler in gym bag during ALL cardio'
    ])));
    add(card(title('12-WEEK CARDIO PROGRESSION:'), table(['Weeks', 'HIIT (Mon/Thu)', 'Steady (Tue)', 'Notes'], [
      ['1-2', '12 min (10 rounds)', '12 min easy', 'Build the habit, find your pace'],
      ['3-4', '15 min (15 rounds)', '15 min', 'Full protocol — Week 4 is deload: halve it'],
      ['5-8', '15-18 min', '15-18 min', 'Push sprint effort, same rest (Week 8 deload: halve)'],
      ['9-12', '18-20 min', '20 min', 'Fitter lungs, faster fat loss — finish strong']
    ])));
    add(coach('Cardio gradually increases. Week 1 lo 12 min HIIT hard ga feel avutundi. Week 12 ki 20 min easy avutundi — that\'s your cardiovascular fitness improving. Don\'t jump ahead. Follow the progression. Your lungs will thank you. 💪'));

    add(banner('EVENING SESSION (WITH BUJJI) + OPTIONAL ACCELERATOR'));
    add(card(
      title('EVENING ROUTINE (6:30-7:30 PM — with Bujji):'),
      bullets([
        'LIGHT active recovery ONLY — 15-20 min easy cardio + 15-20 min cycling',
        'Conversational pace. NO weights, NO HIIT in the evening.',
        'Assist Bujji with her session — this is together-time, not training-time',
        'Morning session is where the work happens; evening is recovery + consistency'
      ]),
      title('IF YOU WANT AN EXTRA BURN (optional):'),
      table(['Option', 'Duration', 'Est. burn', 'Best for'], [
        ['Incline Treadmill Walk', '30-45 min', '~250-350 cal', 'Low impact, joint-friendly'],
        ['Stationary Bike', '30-40 min', '~200-300 cal', 'Asthma-safe, easy'],
        ['Elliptical', '30 min', '~200-280 cal', 'Full body, joint-friendly'],
        ['Walk with Arjun & Arya', '45-60 min', '~250-350 cal', 'FREE + dog time!']
      ])));
    add(card(title('WHEN TO SKIP:'), bullets([
      'Slept less than 5 hours last night',
      'Sharp pain (not just tightness)',
      'Feeling dizzy or unwell',
      'Asthma acting up (weather change, dust exposure)'
    ])));
    add(coach('Evening session = BONUS, not COMPULSORY. Idi cheyyakapoina nee plan work avutundi. Chesthe faster results vastai. Bujji tho evening session = consistency + together-time. 🐶🐶'));

    add(banner('PROGRESSION RULES & DELOAD PROTOCOL'));
    add(card(title('THE GOLDEN RULES:'), bullets([
      '12-REP RULE: last 2 reps should feel challenging. Not impossible, not easy.',
      'INCREASE: add 2.5-5 kg when ALL sets feel comfortable with good form',
      'FREQUENCY: increase weights every 2-3 weeks (not every session)',
      'FORM BREAKS = weight is too heavy. Drop it. No shame.',
      'TRACK EVERYTHING: log weights in the Gym Log tab — it remembers per exercise, per day.'
    ])));
    add(card(title('DELOAD PROTOCOL (Week 4 & Week 8):'), bullets([
      'REDUCE volume by 50% but KEEP the same weights',
      'Same exercises, same weights — but only 2 sets instead of 3-4',
      'Cut HIIT in half (15 min → 7 min)',
      'This lets joints, tendons and nervous system recover',
      'You\'ll feel STRONGER in Week 5 and Week 9 because of this',
      'The Gym Log marks deload weeks automatically.'
    ])));
    add(card(title('SIGNS YOU NEED AN UNPLANNED DELOAD:'), bullets([
      'Weights that were easy suddenly feel impossible',
      'Sleep quality drops for 3+ days',
      'Joint pain (not muscle soreness — actual JOINT pain)',
      'Motivation completely vanishes for 3+ days',
      'Getting sick frequently'
    ])));
    add(coach('Deload scary ga anipistundi — "I\'m losing progress!" No. You\'re BANKING progress. Without deloads, your body accumulates fatigue until something breaks (injury/burnout). Planned deloads at Week 4 & 8 mean you NEVER hit that wall. Smart training > hard training. 🧠'));

    add(banner('MONTHLY MILESTONE CHECKPOINTS'));
    add(card(table(['Period', 'Expected Weight', 'Lost This Month', 'Total Lost'],
      P.milestones.map(function (m) { return [m.period, m.weight, m.lost, m.total]; }))));
    add(card(
      title('WHY MONTH 1 SHOWS THE BIGGEST DROP:'),
      bullets([
        'Water weight sheds first (glycogen depletion = water release)',
        'Body is "shocked" into response from new training stimulus',
        'Months 2-3 are mostly fat loss — slower but more meaningful'
      ]),
      title('SCALE LIES TO WATCH FOR:'),
      bullets([
        'Weight goes UP 1-2 kg some days → water retention (salt, carbs, sleep). Normal.',
        'Weight stalls for 7-10 days → "whoosh effect" coming. Stay the course.',
        'Always weigh SAME TIME (after morning pee, before food/water) — log it in Progress.'
      ])));
    add(coach('Month 1 lo 6-7 kg drop chusinappudu, excited avvu but overconfident avvaku. Months 2-3 lo progress slow avutundi — that\'s where 90% quit. You won\'t. Nuvvu different. Scale number tho paatu, mirror check cheyyi, old clothes try cheyyi, gym weights track cheyyi. Multiple signals > one number. 🐻'));
    add(quote('"The scale measures gravity, not your worth. Trust the process." 💪'));

    add(banner('SUPPLEMENT PROTOCOL'));
    add(card(table(['Phase', 'Dose', 'Why'],
      P.supplements.phases.map(function (ph) { return [ph.weeks, ph.dose, ph.why]; })),
      h('p', { class: 'lead' }, P.supplements.creatine)));
    add(card(
      title('QUANTITIES & DURATION:'),
      table(['Supplement', 'Bag Size', 'Daily Usage', 'Lasts', 'Cost (approx)'], [
        ['Whey Protein', '2 kg', 'Half scoop Wk 1-3, full scoop (35g) Wk 4+', '~9.5 weeks — reorder around Week 8', '~₹5,500-6,000'],
        ['Creatine', '500g', '5g every day', '~100 days — covers all 90', '~₹900-1,000']
      ]),
      h('p', { class: 'lead' }, 'Brand: AS-IT-IS ONE Whey Protein Concentrate (28g protein per 35g scoop, unflavoured, Labdoor certified) + AS-IT-IS Creatine Monohydrate. Unflavoured — add a pinch of cocoa or mix with black coffee.')));
    add(h('div', { class: 'stop-card' },
      h('h4', {}, '⚠ STOP whey immediately if:'),
      bullets(P.supplements.stopSigns),
      h('p', {}, P.healthNotes.disclaimer)));
    add(coach('Whey is your INSURANCE — take it DAILY, not just gym days. Because of your fatty liver (Grade-II), we START with half dose for 3 weeks. Idi precaution, panic kaadu. Week 4 ki full scoop. Creatine is kidney-processed (not liver) so full 5g from Day 1. Both daily. Simple math. 🐻'));
    add(quote('"Supplements amplify hard work. They don\'t replace it." ⚡'));

    clear(host).appendChild(frag);
  }

  /* ================= DIET PLAN ================= */

  var dietSections = ['meals', 'protein', 'nonveg', 'weekly', 'curd'];

  function renderDiet() {
    var host = document.getElementById('diet-content');
    if (!host) return;
    var frag = document.createDocumentFragment();
    var add = function (n) { window.TF_UI.append(frag, n); };

    add(h('div', { class: 'stats-grid' }, N.stats.map(function (s) {
      return h('div', { class: 'stat-tile' }, h('div', { class: 'val' }, s.val), h('div', { class: 'label' }, s.label));
    })));

    add(banner('MY APPROACH TO VARIETY'));
    add(card(h('p', { class: 'lead' }, N.approach.intro), table(N.approach.table.head, N.approach.table.rows)));

    // sub-tabs
    var tabBtns = h('div', { class: 'sub-tabs', role: 'tablist', 'aria-label': 'Diet plan sections' });
    var labels = { meals: 'Daily Meals', protein: 'Protein Sources', nonveg: 'Non-Veg', weekly: 'Weekly Planner', curd: 'Curd vs Yogurt' };
    dietSections.forEach(function (sec, i) {
      tabBtns.appendChild(h('button', {
        type: 'button', class: 'sub-tab' + (i === 0 ? ' active' : ''), role: 'tab',
        id: 'diet-subtab-' + sec, 'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': 'diet-sec-' + sec,
        onclick: function () { showDietSection(sec); }
      }, labels[sec]));
    });
    add(tabBtns);

    add(h('div', { class: 'diet-section', id: 'diet-sec-meals', role: 'tabpanel', 'aria-labelledby': 'diet-subtab-meals' }, buildMeals()));
    add(h('div', { class: 'diet-section', id: 'diet-sec-protein', role: 'tabpanel', 'aria-labelledby': 'diet-subtab-protein', hidden: true }, buildProtein()));
    add(h('div', { class: 'diet-section', id: 'diet-sec-nonveg', role: 'tabpanel', 'aria-labelledby': 'diet-subtab-nonveg', hidden: true }, buildNonveg()));
    add(h('div', { class: 'diet-section', id: 'diet-sec-weekly', role: 'tabpanel', 'aria-labelledby': 'diet-subtab-weekly', hidden: true }, buildWeekly()));
    add(h('div', { class: 'diet-section', id: 'diet-sec-curd', role: 'tabpanel', 'aria-labelledby': 'diet-subtab-curd', hidden: true }, buildCurd()));

    clear(host).appendChild(frag);
  }

  function showDietSection(sec) {
    dietSections.forEach(function (s) {
      var panel = document.getElementById('diet-sec-' + s);
      var tab = document.getElementById('diet-subtab-' + s);
      if (panel) panel.hidden = s !== sec;
      if (tab) {
        tab.classList.toggle('active', s === sec);
        tab.setAttribute('aria-selected', s === sec ? 'true' : 'false');
      }
    });
  }

  function buildMeals() {
    var out = [];
    out.push(banner(N.preworkout.title));
    out.push(card(table(N.preworkout.head, N.preworkout.rows), coach(N.preworkout.note, 'Coach\'s Note:')));
    out.push(banner(N.shake.title));
    out.push(card(
      table(N.shake.head, N.shake.rows),
      h('p', { class: 'lead' }, N.shake.why),
      h('p', { class: 'lead' }, N.shake.how),
      h('div', { class: 'stop-inline' }, '⚠ ' + N.shake.stop),
      coach(N.shake.math, 'Daily Protein Math:')));
    out.push(banner(N.breakfast.title));
    out.push(card(table(N.breakfast.head, N.breakfast.rows), coach(N.breakfast.note, 'Coach\'s Note:')));
    out.push(banner(N.lunch.title));
    out.push(card(title(N.lunch.plate.title), table(N.lunch.plate.head, N.lunch.plate.rows)));
    out.push(card(title(N.lunch.proteins.title), table(N.lunch.proteins.head, N.lunch.proteins.rows)));
    out.push(card(title('Vegetable Rotation (pick 2-3 daily):'), bullets(N.lunch.vegetables),
      title('Grain Rotation:'), bullets(N.lunch.grains), coach(N.lunch.note, 'Coach\'s Note:')));
    out.push(banner(N.snack.title));
    out.push(card(table(N.snack.head, N.snack.rows), coach(N.snack.note, 'Coach\'s Note:')));
    out.push(banner(N.dinner.title));
    out.push(card(title(N.dinner.base.title), table(N.dinner.base.head, N.dinner.base.rows)));
    out.push(card(title(N.dinner.curries.title), table(N.dinner.curries.head, N.dinner.curries.rows), coach(N.dinner.note, 'Coach\'s Note:')));
    out.push(banner(N.hydration.title));
    out.push(card(table(N.hydration.head, N.hydration.rows), h('p', { class: 'lead' }, N.coachHydrationNote)));
    return out;
  }

  function buildProtein() {
    var out = [];
    out.push(banner('COMPLETE PROTEIN SOURCE LIST'));
    out.push(card(title(N.proteinSources.veg.title), table(N.proteinSources.veg.head, N.proteinSources.veg.rows)));
    out.push(card(title(N.proteinSources.nonveg.title), table(N.proteinSources.nonveg.head, N.proteinSources.nonveg.rows), coach(N.proteinSources.note, 'Coach\'s Note:')));
    return out;
  }

  function buildNonveg() {
    var out = [];
    out.push(banner(N.nonvegSwaps.title));
    out.push(card(h('p', { class: 'lead' }, N.nonvegSwaps.intro), table(N.nonvegSwaps.head, N.nonvegSwaps.rows), coach(N.nonvegSwaps.note, 'Coach\'s Note:')));
    return out;
  }

  function buildWeekly() {
    var out = [];
    out.push(banner(N.weeklyPlanner.title));
    out.push(card(table(N.weeklyPlanner.head, N.weeklyPlanner.rows), h('p', { class: 'lead' }, N.weeklyPlanner.note)));
    out.push(banner(N.summary.title));
    out.push(card(table(N.summary.head, N.summary.rows, { rowHeader: true }), coach(N.summary.note, 'Coach\'s Note:')));
    return out;
  }

  function buildCurd() {
    var out = [];
    out.push(banner(N.curdYogurt.title));
    out.push(card(table(N.curdYogurt.compare.head, N.curdYogurt.compare.rows, { rowHeader: true })));
    out.push(card(title(N.curdYogurt.quantities.title), table(N.curdYogurt.quantities.head, N.curdYogurt.quantities.rows), coach(N.curdYogurt.note, 'Coach\'s Take:')));
    return out;
  }

  window.TF_REFERENCE = { boot: boot };
})();
