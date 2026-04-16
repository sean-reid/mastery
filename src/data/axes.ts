export interface AxisDefinition {
  key: string;
  name: string;
  shortName: string;
  weight: number;
  description: string;
  example: string;
}

export const AXES: AxisDefinition[] = [
  {
    key: 'time_to_competence',
    name: 'Time to Basic Competence',
    shortName: 'Competence',
    weight: 0.06,
    description: 'Hours or months to perform the activity at a functional level.',
    example: 'Juggling 3 balls: a weekend. Mandarin literacy: years.',
  },
  {
    key: 'time_to_expert',
    name: 'Time to Expert Performance',
    shortName: 'Mastery',
    weight: 0.08,
    description: 'Years to reach the top ~1% of proficiency.',
    example: 'Chess grandmaster: ~10 years. Concert piano: 15-20 years.',
  },
  {
    key: 'feedback_delay',
    name: 'Feedback Delay',
    shortName: 'Feedback',
    weight: 0.05,
    description: 'How quickly you learn whether you did it right.',
    example: 'Tetris: instant. Surgery: days or weeks. Perfumery: months.',
  },
  {
    key: 'failure_cost',
    name: 'Failure Cost',
    shortName: 'Failure',
    weight: 0.04,
    description: 'Consequences of getting it wrong, from trivial to catastrophic.',
    example: 'Stone skipping: none. Highlining: injury. Cardiac surgery: fatal.',
  },
  {
    key: 'cognitive_demand',
    name: 'Cognitive Demand',
    shortName: 'Cognitive',
    weight: 0.07,
    description: 'Working memory, pattern recognition, and decision complexity.',
    example: 'Air traffic control: extreme. Golf: moderate. Stone balancing: low.',
  },
  {
    key: 'physical_demand',
    name: 'Physical Demand',
    shortName: 'Physical',
    weight: 0.05,
    description: 'Strength, endurance, coordination, and flexibility required.',
    example: 'Gymnastics: extreme. Chess: minimal. Glassblowing: moderate.',
  },
  {
    key: 'prerequisite_knowledge',
    name: 'Prerequisite Knowledge',
    shortName: 'Prerequisites',
    weight: 0.05,
    description: 'How much you need to know before you can even begin.',
    example: 'Pure math research: years of foundations. Flint knapping: almost none.',
  },
  {
    key: 'measurability',
    name: 'Measurability of Progress',
    shortName: 'Measurable',
    weight: 0.04,
    description: 'How objectively you can track improvement.',
    example: 'Chess Elo: precise. Comedy: subjective. Speed climbing: to the hundredth.',
  },
  {
    key: 'perishability',
    name: 'Perishability',
    shortName: 'Perishable',
    weight: 0.05,
    description: 'How fast the skill degrades without practice.',
    example: 'Languages atrophy fast. Cycling barely fades. Music sight-reading decays quickly.',
  },
  {
    key: 'precision_required',
    name: 'Precision Required',
    shortName: 'Precision',
    weight: 0.06,
    description: 'Tolerance for error in execution.',
    example: 'Watchmaking: sub-millimeter. Parkour: inches matter. Diplomacy: approximate.',
  },
  {
    key: 'ambiguity',
    name: 'Ambiguity of Correctness',
    shortName: 'Ambiguity',
    weight: 0.04,
    description: 'Whether "right" is clearly defined or deeply subjective.',
    example: 'Math proof: binary. Perfumery: almost entirely subjective. Go: clear winner.',
  },
  {
    key: 'instruction_dependency',
    name: 'Instruction Dependency',
    shortName: 'Instruction',
    weight: 0.05,
    description: 'How much you need a teacher versus learning on your own.',
    example: 'Violin: nearly impossible self-taught. Chess: self-study works. Surgery: mandatory apprenticeship.',
  },
  {
    key: 'environmental_variability',
    name: 'Environmental Variability',
    shortName: 'Environment',
    weight: 0.04,
    description: 'How much conditions change between attempts.',
    example: 'Golf: wind, terrain, weather. Chess: identical every game. Surfing: never the same wave.',
  },
  {
    key: 'concurrent_skills',
    name: 'Concurrent Sub-skill Load',
    shortName: 'Multitask',
    weight: 0.06,
    description: 'How many things you must do simultaneously.',
    example: 'Pipe organ: 4+ limbs + registration changes. Freediving: equalization + depth + mental state.',
  },
  {
    key: 'plateau_density',
    name: 'Plateau Density',
    shortName: 'Plateaus',
    weight: 0.06,
    description: 'How often progress stalls despite sustained effort.',
    example: 'Go: infamous "wall" at mid-kyu. Golf: improvement comes in bursts after long flats.',
  },
  {
    key: 'domain_evolution',
    name: 'Domain Evolution Rate',
    shortName: 'Evolution',
    weight: 0.03,
    description: 'How fast the field itself changes.',
    example: 'Flint knapping: unchanged for 100,000 years. Competitive Starcraft: patches every month.',
  },
  {
    key: 'observability',
    name: 'Observability of Expertise',
    shortName: 'Observable',
    weight: 0.05,
    description: 'How visible the gap between novice and master is to an outsider.',
    example: 'Gymnastics: immediately obvious. Go: two players look identical to the untrained eye.',
  },
  {
    key: 'luck_variance',
    name: 'Luck / Variance Ratio',
    shortName: 'Luck',
    weight: 0.04,
    description: 'How much randomness affects outcomes.',
    example: 'Poker: high variance short-term. Chess: nearly zero. Golf: moderate (wind, bounce).',
  },
  {
    key: 'social_coordination',
    name: 'Social Coordination Load',
    shortName: 'Social',
    weight: 0.03,
    description: 'How much success depends on reading or coordinating with others.',
    example: 'Diplomacy: almost entirely social. Freediving: solo. Calcio Storico: 27-person team.',
  },
];

export function computeComposite(
  scores: Record<string, { value: number }>
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const axis of AXES) {
    const score = scores[axis.key];
    if (score) {
      weightedSum += score.value * axis.weight;
      totalWeight += axis.weight;
    }
  }

  return totalWeight > 0
    ? Math.round((weightedSum / totalWeight) * 10) / 10
    : 0;
}
