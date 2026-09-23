// Tiger Fitness — program data (single source of truth for plans & trackers).
// IMPORTANT: exercise order inside each day matches the legacy prototype exactly;
// legacy per-date weights are migrated by position, so do not reorder without a migration.
window.TF_PROGRAM = {
  meta: {
    name: "Tiger's 90-Day Transformation",
    startWeightKg: 107.15,
    targetKg: '87\u201390',
    ratePerWeek: '~1.4 kg/wk',
    programDays: 90,
    warmupDays: 4
  },

  // Defaults; the actual dates live in settings and are editable (Settings > Program dates).
  defaults: {
    warmupStart: '2026-09-24', // Thu
    programStart: '2026-09-28' // Mon (Day 1)
  },

  focus: {
    Monday: 'Chest + Shoulders',
    Tuesday: 'Back + Biceps',
    Wednesday: 'Legs',
    Thursday: 'Shoulders + Arms',
    Friday: 'Rest / Walk',
    Saturday: 'Full Body',
    Sunday: 'Core + Cardio'
  },

  // 10-minute daily warm-up — every session (asthma-safe ramp-in).
  dailyWarmup: [
    { name: 'Treadmill Walk (5 km/h)', meta: '5 minutes — raise heart rate' },
    { name: 'Arm Circles (fwd + back)', meta: '20 each way — shoulder mobility' },
    { name: 'Hip Rotations', meta: '15 each way — hip prep' },
    { name: 'Bodyweight Squats', meta: '15 reps — activate legs' },
    { name: 'Leg Swings (front-back)', meta: '10 each leg — hamstrings + hips' }
  ],

  // Recurring weekly split (order preserved from legacy weeklyPlan).
  weeklyPlan: {
    Monday: [
      { id: 'bench-press', name: 'Flat Bench Press (Barbell)', sets: '4 x 8-10', rest: '90s', video: 'https://www.youtube.com/watch?v=rT7DgCr-3pg', weight: true },
      { id: 'incline-db-press', name: 'Incline Dumbbell Press', sets: '3 x 10-12', rest: '75s', video: 'https://www.youtube.com/watch?v=8iPEnn-ltC8', weight: true },
      { id: 'cable-fly', name: 'Cable Fly (Low to High)', sets: '3 x 12-15', rest: '60s', video: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o', weight: true },
      { id: 'ohp-db', name: 'Overhead Shoulder Press (DB)', sets: '3 x 10-12', rest: '75s', video: 'https://www.youtube.com/watch?v=qEwKCR5JCog', weight: true },
      { id: 'lateral-raise', name: 'Lateral Raises', sets: '3 x 12-15', rest: '60s', video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', weight: true },
      { id: 'hiit-bike', name: 'HIIT: Stationary Bike', sets: '15 min', rest: '30s sprint / 30s easy x 15', video: 'https://www.youtube.com/watch?v=TkQ-zQH0sbc', weight: false }
    ],
    Tuesday: [
      { id: 'lat-pulldown-wide', name: 'Lat Pulldown (Wide Grip)', sets: '4 x 10-12', rest: '75s', video: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', weight: true },
      { id: 'seated-cable-row', name: 'Seated Cable Row', sets: '4 x 10-12', rest: '75s', video: 'https://www.youtube.com/watch?v=GZbfZ033f74', weight: true },
      { id: 'db-row', name: 'Single-Arm Dumbbell Row', sets: '3 x 10 each arm', rest: '60s', video: 'https://www.youtube.com/watch?v=roCP6wCXPqo', weight: true },
      { id: 'barbell-curl', name: 'Barbell Curl', sets: '3 x 10-12', rest: '60s', video: 'https://www.youtube.com/watch?v=kwG2ipFRgFo', weight: true },
      { id: 'hammer-curl', name: 'Hammer Curl', sets: '3 x 12', rest: '60s', video: 'https://www.youtube.com/watch?v=zC3nLlEvin4', weight: true },
      { id: 'plank', name: 'Plank Hold', sets: '3 x 30-45s', rest: '30s', video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c', weight: false },
      { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', sets: '3 x 12-15', rest: '30s', video: 'https://www.youtube.com/watch?v=hdng3Nm1x_E', weight: false },
      { id: 'steady-bike', name: 'Steady State: Bike', sets: '15 min', rest: 'conversational pace', video: 'https://www.youtube.com/watch?v=TkQ-zQH0sbc', weight: false }
    ],
    Wednesday: [
      { id: 'leg-press', name: 'Leg Press', sets: '4 x 10-12', rest: '90s', video: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', weight: true },
      { id: 'squat', name: 'Barbell Squat (Smith Machine OK)', sets: '4 x 8-10', rest: '90s', video: 'https://www.youtube.com/watch?v=ultWZbUMPL8', weight: true },
      { id: 'rdl', name: 'Romanian Deadlift (DB or BB)', sets: '3 x 10-12', rest: '75s', video: 'https://www.youtube.com/watch?v=7j-2w4-P14I', weight: true },
      { id: 'leg-extension', name: 'Leg Extension', sets: '3 x 12-15', rest: '60s', video: 'https://www.youtube.com/watch?v=YyvSfVjQeL0', weight: true },
      { id: 'hamstring-curl', name: 'Hamstring Curl (Lying)', sets: '3 x 12-15', rest: '60s', video: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs', weight: true },
      { id: 'calf-raise', name: 'Standing Calf Raises', sets: '4 x 15-20', rest: '45s', video: 'https://www.youtube.com/watch?v=gwLzBJYoWlI', weight: true },
      { id: 'stair-climber', name: 'Stair Climber', sets: '10 min', rest: 'moderate pace', video: 'https://www.youtube.com/watch?v=9cUoLCJo1mA', weight: false }
    ],
    Thursday: [
      { id: 'shoulder-press', name: 'Shoulder Press (BB or DB)', sets: '4 x 8-10', rest: '75s', video: 'https://www.youtube.com/watch?v=qEwKCR5JCog', weight: true },
      { id: 'ss-lat-front', name: 'SS: Lateral Raise + Front Raise', sets: '3 x 12 each', rest: '60s after pair', video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', weight: true },
      { id: 'ss-curl-pushdown', name: 'SS: Bicep Curl + Tricep Pushdown', sets: '3 x 12 each', rest: '60s after pair', video: 'https://www.youtube.com/watch?v=kwG2ipFRgFo', weight: true },
      { id: 'ss-hammer-ohext', name: 'SS: Hammer Curl + OH Tricep Extension', sets: '3 x 12 each', rest: '60s after pair', video: 'https://www.youtube.com/watch?v=zC3nLlEvin4', weight: true },
      { id: 'hiit-bike', name: 'HIIT: Stationary Bike', sets: '15 min', rest: '30s sprint / 30s easy x 15', video: 'https://www.youtube.com/watch?v=TkQ-zQH0sbc', weight: false }
    ],
    Friday: [
      { id: 'rest-walk', name: 'REST DAY — Walk with Arjun & Arya', sets: '30-60 min', rest: 'easy pace', video: '', weight: false }
    ],
    Saturday: [
      { id: 'goblet-squat', name: 'Goblet Squat', sets: '3 x 12', rest: '60s', video: 'https://www.youtube.com/watch?v=MeIiIdhvXT4', weight: true },
      { id: 'lat-pulldown-close', name: 'Lat Pulldown (Close Grip)', sets: '3 x 12', rest: '60s', video: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', weight: true },
      { id: 'chest-press-machine', name: 'Chest Press Machine', sets: '3 x 12', rest: '60s', video: 'https://www.youtube.com/watch?v=xUm0BiZCWlQ', weight: true },
      { id: 'shoulder-press-machine', name: 'Shoulder Press Machine', sets: '3 x 12', rest: '60s', video: 'https://www.youtube.com/watch?v=Wqq43dKoG2Q', weight: true },
      { id: 'seated-row-machine', name: 'Seated Row Machine', sets: '3 x 12', rest: '60s', video: 'https://www.youtube.com/watch?v=GZbfZ033f74', weight: true },
      { id: 'dips', name: 'Assisted Dips or Bench Dips', sets: '3 x 10-12', rest: '60s', video: 'https://www.youtube.com/watch?v=2z8JmcrW-As', weight: true },
      { id: 'mixed-cardio', name: 'Mixed Cardio Finisher', sets: '20 min', rest: '7 bike + 7 incline walk + 6 elliptical', video: 'https://www.youtube.com/watch?v=TkQ-zQH0sbc', weight: false }
    ],
    Sunday: [
      { id: 'incline-walk', name: 'Incline Treadmill Walk', sets: '15 min', rest: '10-12% incline, 5.5-6 km/h', video: 'https://www.youtube.com/watch?v=9cUoLCJo1mA', weight: false },
      { id: 'bike', name: 'Stationary Bike', sets: '10 min', rest: 'moderate pace', video: '', weight: false },
      { id: 'plank', name: 'Plank', sets: '3 x 45s', rest: '30s', video: '', weight: false },
      { id: 'russian-twist', name: 'Russian Twists (plate/DB)', sets: '3 x 20', rest: '30s', video: 'https://www.youtube.com/watch?v=wkD8rjkodUI', weight: true },
      { id: 'leg-raise', name: 'Leg Raises', sets: '3 x 15', rest: '30s', video: '', weight: false },
      { id: 'mountain-climber', name: 'Mountain Climbers', sets: '3 x 30s', rest: '30s', video: 'https://www.youtube.com/watch?v=nmwgirgXLYM', weight: false },
      { id: 'weak-point', name: 'Weak Point Work (pick 2 lagging areas)', sets: '2 exercises x 3 x 12-15', rest: '60s', video: '', weight: true }
    ]
  },

  // Warm-up week templates, applied by index to the configured warm-up dates.
  // (Order preserved from legacy dateOverrides for weight migration.)
  warmupTemplates: [
    {
      label: 'Warm-Up Day-1', focus: 'Machine Circuit (light)', time: '45 min', intensity: '50% effort',
      exercises: [
        { id: 'wu-leg-press', name: 'Leg Press (light)', sets: '2 x 12', rest: 'learn the machine', video: '', weight: true },
        { id: 'wu-chest-press', name: 'Chest Press Machine', sets: '2 x 12', rest: 'get comfortable pressing', video: '', weight: true },
        { id: 'wu-lat-pulldown', name: 'Lat Pulldown', sets: '2 x 12', rest: 'pull with lats, not arms', video: '', weight: true },
        { id: 'wu-shoulder-press', name: 'Shoulder Press Machine', sets: '2 x 12', rest: 'shoulder mobility check', video: '', weight: true },
        { id: 'wu-seated-row', name: 'Seated Row', sets: '2 x 12', rest: 'squeeze shoulder blades', video: '', weight: true },
        { id: 'wu-leg-extension', name: 'Leg Extension', sets: '2 x 12', rest: 'warm up knees', video: '', weight: true },
        { id: 'wu-bike', name: 'Stationary Bike', sets: '15 min', rest: 'cardio baseline', video: '', weight: false }
      ]
    },
    {
      label: 'Warm-Up Day-2', focus: 'Active Recovery', time: '40 min', intensity: 'Easy',
      exercises: [
        { id: 'wu-incline-walk', name: 'Incline Treadmill Walk', sets: '25 min easy', rest: '', video: '', weight: false },
        { id: 'wu-stretch', name: 'Full Body Stretch', sets: '15 min', rest: 'hold each stretch 20-30s', video: '', weight: false }
      ]
    },
    {
      label: 'Warm-Up Day-3', focus: 'Machine Circuit (light)', time: '50 min', intensity: '60% effort',
      exercises: [
        { id: 'wu-leg-press', name: 'Leg Press', sets: '2 x 12', rest: 'slightly heavier than Day-1', video: '', weight: true },
        { id: 'wu-chest-press', name: 'Chest Press Machine', sets: '2 x 12', rest: '', video: '', weight: true },
        { id: 'wu-lat-pulldown', name: 'Lat Pulldown', sets: '2 x 12', rest: '', video: '', weight: true },
        { id: 'wu-shoulder-press', name: 'Shoulder Press Machine', sets: '2 x 12', rest: '', video: '', weight: true },
        { id: 'wu-seated-row', name: 'Seated Row', sets: '2 x 12', rest: '', video: '', weight: true },
        { id: 'wu-leg-extension', name: 'Leg Extension', sets: '2 x 12', rest: '', video: '', weight: true },
        { id: 'wu-stair-climber', name: 'Stair Climber', sets: '10 min', rest: 'cardio baseline', video: '', weight: false }
      ]
    },
    {
      label: 'Warm-Up Day-4', focus: 'Active Recovery', time: '35 min', intensity: 'Recovery',
      exercises: [
        { id: 'wu-bike', name: 'Stationary Bike', sets: '20 min', rest: 'conversational pace', video: '', weight: false },
        { id: 'wu-stretch', name: 'Stretching', sets: '10 min', rest: '', video: '', weight: false },
        { id: 'wu-foam-roll', name: 'Foam Roll', sets: '5 min', rest: '', video: '', weight: false }
      ]
    }
  ],

  // Extension point: date-specific plan overrides (checked for EVERY day, before weeklyPlan).
  // e.g. '2026-11-02': { label: 'Deload Day', focus: 'Deload', exercises: [...] }
  dateOverrides: {},

  // Deload guidance surfaces on these program weeks (1-based).
  deloadWeeks: [4, 8],

  coachNotes: {
    Monday: "Bench press first because it's the heaviest compound — you're freshest now. Cable fly last because it's isolation. HIIT on bike, not treadmill — asthma-safe, no dust, controlled breathing. 30s on/30s off is brutal but effective.",
    Tuesday: 'Back day = posture day. At 107 kg, your back muscles need to be STRONG to support your spine. Lat pulldown + rows build that foundation. Biceps get work from pulling, so we only need 2 direct exercises. Core at the end — plank + leg raises is a killer combo.',
    Wednesday: "LEG DAY = FAT LOSS DAY. Your legs are the biggest muscle group. Training them burns the MOST calories. Leg press first (safer than squats at your weight), then squat. RDL for hamstrings + glutes. Stair climber finisher — your legs will be SCREAMING. That's the sound of fat dying.",
    Thursday: "Supersets make Thursday EFFICIENT. Same work in less time + higher heart rate = more calories burned. Arms recover fast (small muscles), so supersets work perfectly here. HIIT finisher because you've still got gas in the tank after arms.",
    Friday: 'Rest day ante lazy day kaadu, Tiger. It\'s ACTIVE RECOVERY. Nee body ni rebuild chestundi — damaged muscle fibers repair avutayi, stronger ga vastai. Arjun & Arya tho walk cheyyi, stretch cheyyi, hydrate cheyyi. Saturday ki FRESH ga ready avvu. 🐻',
    Saturday: 'Saturday is FULL BODY because every muscle gets stimulated twice per week (once on its dedicated day + once here). Machines on Saturday = safer when fatigued from the week. Cardio finisher uses 3 different machines to prevent boredom and hit different movement patterns.',
    Sunday: "Sunday is your ADVANTAGE day, Tiger. While everyone else is sleeping in or eating biryani, you're building your body. LISS cardio burns fat at low intensity. Core makes your midsection tight. Weak point work targets whatever lagged behind this week. 🐻",
    warmup: 'This week is about LEARNING, not lifting. Pick weights that feel almost too easy — focus on machine adjustments, feeling the muscle work, and your breathing pattern. ASTHMA: keep your inhaler in your bag, never skip the 5-min treadmill walk before starting. Start waking at 4:45–5:00 AM now to build the habit for Day 1. 🐻🔥'
  },

  quotes: {
    Monday: '"Chest day is the day you build your armor." 🛡️',
    Wednesday: '"Friends don\'t let friends skip leg day." 🦵',
    Friday: '"Rest is not laziness. It\'s preparation for war." ⚔️',
    Sunday: '"While they sleep on Sunday, you\'re building a new body." 💪'
  },

  // Fixed daily diet checklist (ids are persisted — do not rename).
  dietItems: [
    { id: 'preworkout', label: 'Pre-Workout Meal', icon: '⚡' },
    { id: 'whey', label: 'Whey Shake', icon: '💪', phased: true },
    { id: 'creatine', label: 'Creatine (5g)', icon: '💊' },
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '🍛' },
    { id: 'snack', label: 'Evening Snack', icon: '🕐' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'walk', label: 'Evening Walk / LISS', icon: '🚶' },
    { id: 'sleep', label: 'Sleep 7+ hours', icon: '😴' }
  ],
  waterGoal: 12,     // glasses shown
  waterOnTrackMin: 8, // glasses that earn the water point
  onTrackRatio: 0.8,  // >= 80% of points (9 items + 1 water point)

  milestones: [
    { period: 'START', weight: '107.15 kg', lost: '—', total: '—' },
    { period: 'MONTH 1 (Day 30)', weight: '~100-101 kg', lost: '6-7 kg', total: '6-7 kg' },
    { period: 'MONTH 2 (Day 60)', weight: '~94-96 kg', lost: '5-6 kg', total: '11-13 kg' },
    { period: 'MONTH 3 (Day 90)', weight: '~87-90 kg 🎉', lost: '4-5 kg', total: '17-20 kg 🔥' }
  ],

  supplements: {
    phases: [
      { weeks: 'Weeks 1-3', dose: 'HALF scoop whey (17g = 14g protein) + 5g creatine + 200ml water', why: 'Eased liver load during initial adaptation (Grade-II fatty liver)' },
      { weeks: 'Week 4+', dose: 'FULL scoop whey (35g = 28g protein) + 5g creatine + 200ml water', why: 'Full dose — liver improving from weight loss + exercise' }
    ],
    creatine: 'Creatine 5g daily from Day 1 — kidney-processed, not liver.',
    stopSigns: [
      'Upper-right abdomen pain',
      'Unusual fatigue',
      'Dark urine (not dehydration)',
      'Nausea after shake'
    ],
    reorderNote: 'A 2 kg whey bag at half dose for 3 weeks then full dose lasts ~9.5 weeks — reorder around Week 8. Creatine 500g covers the full 90 days.'
  },

  healthNotes: {
    asthma: 'ASTHMA: warm-up is NON-NEGOTIABLE. Cold gym air + sudden exertion can trigger bronchospasm. 5-min treadmill walk gradually opens airways. Inhaler within arm\'s reach always. HIIT on bike, never treadmill.',
    liver: 'Grade-II fatty liver: whey starts at HALF dose for Weeks 1-3, full scoop from Week 4. STOP whey immediately if: upper-right abdomen pain, unusual fatigue, dark urine, or nausea after shake.',
    ego: 'FORM > EGO. Always. Light weight + perfect form beats heavy weight + bad form. Injury costs weeks.',
    disclaimer: 'This plan was built for one specific person and is not medical advice. Review supplements, calorie targets and training with a qualified clinician — especially with fatty liver and asthma in the picture.'
  }
};
