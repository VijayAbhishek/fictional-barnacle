// Tiger Fitness — nutrition reference data (renders the Diet Plan tab).
window.TF_NUTRITION = {
  header: {
    title: 'TIGER & BUJJI DIET PLAN',
    subtitle: 'Same food, different portions | Weeks 1-3: ~110-120g protein | Week 4+: ~125-135g protein'
  },
  stats: [
    { val: '110-135g', label: 'Tiger Protein/day (phased)' },
    { val: '82-93g', label: 'Bujji Protein/day' },
    { val: '3.5-4L', label: 'Water/day' },
    { val: '₹3-4K', label: 'Monthly Budget' }
  ],
  approach: {
    intro: 'Instead of one fixed meal for each slot, here\'s a rotating menu — multiple options per meal so you can pick based on mood, what\'s available, and what you feel like:',
    table: {
      head: ['Meal', '# Options', 'Rotation Style'],
      rows: [
        ['Pre-workout', '5 options', 'Pick any one daily'],
        ['Breakfast', '7 options', 'Rotate through the week (or pick by mood)'],
        ['Lunch', '6-8 combos', 'Mix-and-match protein + grain + veggies'],
        ['Evening Snack', '6 options', 'Pick one'],
        ['Dinner', '6 curry options', 'Rotate curries through the week'],
        ['Non-Veg Swaps', '5 preparations', 'For days you buy fresh chicken/fish']
      ]
    }
  },

  preworkout: {
    title: 'PRE-WORKOUT (~5:00 AM) — Tiger Only',
    head: ['#', 'Option', 'Protein', 'Calories', 'Prep'],
    rows: [
      ['1', 'Handful soaked moong sprouts + ginger-lemon tea', '~5g', '~80', 'Soak overnight'],
      ['2', '1 banana + black coffee', '~1g', '~110', 'Zero prep'],
      ['3', '5 soaked almonds + 2 dates + green tea', '~3g', '~100', 'Soak overnight'],
      ['4', '1 boiled egg + ginger tea', '~6g', '~90', 'Batch boil night before'],
      ['5', '1 tbsp peanut butter + 1/2 banana', '~4g', '~120', 'Zero prep']
    ],
    note: 'Don\'t overthink this meal. It\'s just quick fuel to prevent training on a completely empty stomach. Pick whatever takes <2 minutes.'
  },

  shake: {
    title: 'PROTEIN SHAKE (Daily ~7:00 AM) — Tiger Only',
    head: ['Phase', 'Dose', 'Protein', 'Calories'],
    rows: [
      ['Weeks 1-3', 'HALF scoop whey (17g) + 5g creatine + 200ml water', '14g', '~70'],
      ['Week 4+', 'Full scoop whey (35g) + 5g creatine + 200ml water', '28g', '~141']
    ],
    why: 'Why phased? Grade-II fatty liver — ease protein load initially. Exercise + weight loss support the liver. Week 4 onwards = full dose (watch the stop-signs below).',
    how: 'Shake 15-30 seconds. Add 1 tsp cocoa powder or mix with black coffee for flavour. No milk, no fruit. Take EVERY day including rest days. Gym days: post-workout. Rest days: morning.',
    stop: 'STOP whey if you notice: upper-right abdomen pain, unusual fatigue, dark urine, or nausea after shake.',
    math: 'Daily protein math — Weeks 1-3: food ~100-106g + whey 14g = ~110-120g total. Week 4+: food ~100-106g + whey 28g = ~125-135g total. Creatine: 5g daily from Day 1 (kidney-processed, not liver).'
  },

  breakfast: {
    title: 'BREAKFAST (~7:30 AM) — Both (No-Cook / Minimal Prep)',
    head: ['#', 'Option', 'Tiger', 'Bujji', 'Protein (T/B)', 'Prep'],
    rows: [
      ['1', 'Overnight Oats', '50g oats + 150g curd + 1 tbsp chia + banana + honey', '40g oats + 100g curd + chia + fruit', '14g / 10g', 'Prep night before'],
      ['2', 'Egg & Fruit', '3 boiled eggs + 1 banana', '2 boiled eggs + 1 apple', '20g / 14g', 'Batch boil eggs'],
      ['3', 'Curd Power Bowl', '200g curd + 30g roasted chana + pumpkin seeds + honey', '150g curd + 20g chana + seeds', '16g / 12g', 'Assemble 2 min'],
      ['4', 'Sprouts Salad', 'Moong+chana sprouts (100g) + onion + lemon + peanuts', '80g sprouts + lemon + peanuts', '12g / 9g', 'Soak 2 days before'],
      ['5', 'Muesli Bowl', '60g muesli + 150ml milk + banana + almonds', '45g muesli + 100ml milk + fruit', '12g / 8g', 'Zero prep'],
      ['6', 'PB Toast', '2 multigrain bread + 2 tbsp PB + banana slices', '1 bread + 1 tbsp PB + fruit', '14g / 8g', '2 min'],
      ['7', 'Banana Oat Shake', '1 banana + 40g oats + 200ml milk + 1 tbsp PB (blend)', 'Same but smaller portion', '14g / 10g', 'Blend 1 min']
    ],
    note: 'Nee breakfast lo cooking undakudadu — 5:30 gym, 7:00 shake, 7:30 breakfast. Total time 5 mins max. Night before prep cheyyi. Rotate 2-3 options per week so you don\'t get bored. 🐻'
  },

  lunch: {
    title: 'LUNCH (~1:00 PM) — Both (Power Meal — Home Cooked)',
    plate: {
      title: 'BUILD YOUR PLATE Formula',
      head: ['Component', 'Tiger', 'Bujji'],
      rows: [
        ['Protein source (pick 1-2)', 'Larger portion', 'Smaller portion'],
        ['Grain', '40-50g raw millet/rice', '35-40g'],
        ['Vegetables', '200g raw', '150g'],
        ['Dal', '50g raw', '40g raw'],
        ['Curd', '150-200g', '150g']
      ]
    },
    proteins: {
      title: 'Protein Source Rotation (pick 1-2 daily)',
      head: ['#', 'Source', 'Tiger', 'Bujji', 'Protein (T/B)'],
      rows: [
        ['1', 'Soya chunks', '40g dry (→120g cooked)', '30g dry', '~20g / ~15g'],
        ['2', 'Boiled eggs', '3-4', '2', '~18-24g / ~12g'],
        ['3', 'Rajma (kidney beans)', '60g dry', '50g dry', '~14g / ~11g'],
        ['4', 'Chole (chickpeas)', '60g dry', '50g dry', '~12g / ~10g'],
        ['5', 'Paneer', '80g', '60g', '~15g / ~11g'],
        ['6', 'Mixed dal (moong+toor)', '60g dry', '50g dry', '~15g / ~12g'],
        ['7', 'Tofu', '100g', '80g', '~12g / ~10g']
      ]
    },
    vegetables: ['Beans + Carrots', 'Capsicum + Onion + Tomato', 'Broccoli + Cauliflower', 'Spinach (Palak)', 'Dondakaya (Tindora)', 'Bhindi (Okra)', 'Cabbage + Peas', 'Drumstick + Cluster beans'],
    grains: ['Foxtail millet (Korralu)', 'Brown rice', 'Quinoa (when budget permits)', 'Regular rice (occasionally)'],
    note: 'Lunch is your BIGGEST meal — post-workout recovery + fuel for the afternoon. Soya + eggs is your cheapest protein combo. Vegetables ni skimp cheyyaku — volume eating is your weapon on 1700 cal. 🐻'
  },

  snack: {
    title: 'EVENING SNACK (~5:00 PM) — Both',
    head: ['#', 'Option', 'Tiger', 'Bujji', 'Protein (T/B)'],
    rows: [
      ['1', 'Curd + Roasted Chana', '150g curd + 30g chana', '100g curd + 20g chana', '~12g / ~8g'],
      ['2', 'Boiled Corn + Peanuts', '1 cob + 20g peanuts', 'Same', '~8g / ~8g'],
      ['3', 'Sprouts Chaat', '80g sprouts + onion + chaat masala', 'Same', '~8g / ~8g'],
      ['4', 'Boiled Egg + Fruit', '1 egg + apple/orange', '1 egg + fruit', '~7g / ~7g'],
      ['5', 'Trail Mix', '20g peanuts + 10g almonds + 5g raisins', 'Same', '~7g / ~7g'],
      ['6', 'Makhana (Foxnuts)', '30g roasted + pinch salt', 'Same', '~5g / ~5g']
    ],
    note: 'Evening snack is a BRIDGE — holds you until dinner and prevents "I\'m starving, let me eat biscuits" moments. Keep it protein-forward. 🐻'
  },

  dinner: {
    title: 'DINNER (~7:00 PM) — Both',
    base: {
      title: 'Base',
      head: ['Component', 'Tiger', 'Bujji'],
      rows: [
        ['Jowar/Ragi rotis', '2', '1'],
        ['Protein curry (from below)', 'Full serving', '3/4 serving'],
        ['Side vegetables', '100-150g', '100g']
      ]
    },
    curries: {
      title: 'Curry Rotation',
      head: ['#', 'Curry', 'Protein (T/B)', 'Type'],
      rows: [
        ['1', 'Egg curry (3 eggs T / 2 B)', '~18g / ~12g', 'Egg'],
        ['2', 'Soya chunk curry', '~18g / ~14g', 'Veg'],
        ['3', 'Dal tadka (toor/moong)', '~12g / ~10g', 'Veg'],
        ['4', 'Rajma masala', '~14g / ~11g', 'Veg'],
        ['5', 'Chole masala', '~12g / ~10g', 'Veg'],
        ['6', 'Palak paneer (occasional)', '~14g / ~11g', 'Veg']
      ]
    },
    note: 'Jowar/Ragi rotis are GOLD — high fibre, slow-digesting carbs, keeps you full longer than wheat roti. Dinner lo oil minimize cheyyi — 1 tsp per curry max. 🐻'
  },

  hydration: {
    title: 'HYDRATION SCHEDULE',
    head: ['Time', 'Target', 'Note'],
    rows: [
      ['Wake up (5 AM)', '1 glass warm water + lemon', 'Kickstart metabolism'],
      ['During gym', '500-750ml sipping', 'Small sips between sets'],
      ['9 AM – 12 PM', '750ml', 'Keep bottle at desk'],
      ['12 PM – 4 PM', '750ml', 'With/after lunch'],
      ['4 PM – 8 PM', '750ml', 'Afternoon hydration'],
      ['Evening', '500ml', 'Not too close to bedtime'],
      ['TOTAL', '3.5 – 4 L', '12-13 glasses']
    ]
  },

  proteinSources: {
    veg: {
      title: 'Vegetarian Sources (Both Tiger & Bujji)',
      head: ['#', 'Source', 'Tiger', 'Bujji', 'Protein (T/B)'],
      rows: [
        ['1', 'Soya chunks', '40g dry (→120g cooked)', '30g dry', '~20g / ~15g'],
        ['2', 'Boiled eggs', '3-4', '2', '~18-24g / ~12g'],
        ['3', 'Rajma (kidney beans)', '60g dry', '50g dry', '~14g / ~11g'],
        ['4', 'Chole (chickpeas)', '60g dry', '50g dry', '~12g / ~10g'],
        ['5', 'Paneer', '80g raw', '60g raw', '~15g / ~11g'],
        ['6', 'Mixed dal (moong+toor)', '60g dry', '50g dry', '~15g / ~12g'],
        ['7', 'Tofu', '100g raw', '80g raw', '~12g / ~10g']
      ]
    },
    nonveg: {
      title: 'Non-Veg Sources (Tiger Only — buy fresh, cook same day)',
      head: ['#', 'Source', 'Tiger', 'Protein', 'Best For'],
      rows: [
        ['8', 'Chicken Breast', '150g raw', '~35g', 'Highest protein/cal ratio'],
        ['9', 'Chicken Thigh', '150g raw', '~30g', 'Tastier, slightly more fat'],
        ['10', 'Fish (Rohu/Tilapia)', '150g raw', '~28g', 'Lean, light on stomach'],
        ['11', 'Fish (Katla/Surmai)', '150g raw', '~30g', 'Omega-3 rich'],
        ['12', 'Prawns', '150g cleaned', '~25g', 'Quick cook, great protein']
      ]
    },
    note: 'Soya + eggs is your BUDGET KING combo — cheapest protein per gram. Paneer is tasty but calorie-dense (watch portions). Non-veg days naturally boost protein — reduce eggs at other meals on those days.'
  },

  nonvegSwaps: {
    title: 'NON-VEG DINNER SWAPS (Tiger — Fresh Day)',
    intro: 'For days when Tiger buys fresh chicken/fish — replace the veg curry at dinner:',
    head: ['#', 'Option', 'Protein', 'Prep Method'],
    rows: [
      ['1', 'Tandoori chicken (150g) + roasted veggies', '~35g', 'Oven grill'],
      ['2', 'Chicken curry (150g) + 1 roti', '~32g', 'Stovetop'],
      ['3', 'Grilled fish (Rohu/Tilapia 150g) + dal', '~30g', 'Pan/Oven'],
      ['4', 'Egg fried rice (4 eggs + veggies, minimal oil)', '~28g', 'Quick stir'],
      ['5', 'Fish curry (150g) + rice', '~28g', 'Stovetop']
    ],
    note: 'Rule: Buy fresh → cook same day. These replace the veg curry slot at dinner — keep roti + salad + curd as sides. Non-veg days = EASY protein days. 🐻'
  },

  weeklyPlanner: {
    title: 'SAMPLE WEEKLY MEAL PLANNER',
    head: ['Day', 'Breakfast', 'Lunch Protein', 'Dinner Curry'],
    rows: [
      ['Mon', 'Overnight oats', 'Soya + 3 eggs', 'Egg curry'],
      ['Tue', 'Egg & Fruit', 'Rajma + 2 eggs', 'Soya curry'],
      ['Wed', 'Curd Power Bowl', 'Soya + 3 eggs', 'Dal tadka'],
      ['Thu', 'Sprouts Salad', 'Chole + 2 eggs', 'Rajma masala'],
      ['Fri', 'PB Toast', 'Paneer + eggs', 'Chole masala'],
      ['Sat', 'Muesli Bowl', 'Soya + 3 eggs', 'Chicken curry (Tiger) / Paneer masala (Bujji)'],
      ['Sun', 'Banana Oat Shake', 'Mixed dal + tofu', 'Palak paneer']
    ],
    note: 'This is a SAMPLE. Mix and match based on mood and what\'s in the fridge. Saturday dinner: chicken is Tiger-only — Bujji takes the paneer/soya version (see Recipes tab for 300 options).'
  },

  summary: {
    title: 'DIET PLAN SUMMARY',
    head: ['', 'Tiger', 'Bujji'],
    rows: [
      ['Daily Calories', '~1700-1850 kcal', '~1400-1500 kcal'],
      ['Daily Protein (Wk 1-3)', '~110-120g (half scoop whey)', '~82-93g'],
      ['Daily Protein (Wk 4+)', '~125-135g (full scoop whey)', '~82-93g'],
      ['Meals', '6 (pre-workout → dinner)', '4-5 (breakfast → dinner)'],
      ['Variety', '5-7 options per meal', 'Same food, smaller portions'],
      ['Budget', 'Within ₹3-4K/month', '']
    ],
    note: 'Sunday evening lo next week ki rough plan veyyi — 5 minutes. Grocery list automatic ga vastundi. Weekly variety undali but daily decision-making undakudadu.'
  },

  curdYogurt: {
    title: 'CURD VS YOGURT (Hung Curd / Greek-style)',
    compare: {
      head: ['', 'Regular Curd', 'Yogurt (Hung/Greek-style)'],
      rows: [
        ['What it is', 'Milk set with culture, whey still present', 'Curd with whey drained — thicker, denser'],
        ['Protein per 100g', '~3-4g', '~6-8g (almost double)'],
        ['Calories per 100g', '~60 kcal', '~90-100 kcal'],
        ['Consistency', 'Runny/soft', 'Thick, creamy'],
        ['Why it matters', 'Good but lower protein density', 'More protein per spoon — better for the cut']
      ]
    },
    quantities: {
      title: 'Suggested Quantities (yogurt gives MORE protein in less volume)',
      head: ['Meal', 'Curd (if using)', 'OR Yogurt (if using)', 'Protein'],
      rows: [
        ['Breakfast (Tiger)', '200g', '150g', '~6-8g curd / ~9-12g yogurt'],
        ['Breakfast (Bujji)', '150g', '120g', '~5-6g curd / ~7-10g yogurt'],
        ['Lunch side (Tiger)', '200g', '150g', '~6-8g curd / ~9-12g yogurt'],
        ['Lunch side (Bujji)', '150g', '120g', '~5-6g curd / ~7-10g yogurt'],
        ['Dinner side (Tiger)', '100g', '80g', '~3-4g curd / ~5-6g yogurt'],
        ['Evening snack (Tiger)', '150g', '120g', '~5-6g curd / ~7-10g yogurt']
      ]
    },
    note: 'Yogurt is actually BETTER for your fat-loss plan — more protein per serving. Since you have a yogurt maker, make yogurt your default. Pro tip: strain regular curd in a muslin cloth for 2-3 hours = homemade Greek yogurt (see recipe PK20).'
  },

  coachHydrationNote: 'Sip through the day — don\'t chug. The tracker counts glasses of ~300ml; 8+ glasses earns the water point for the day.'
};
