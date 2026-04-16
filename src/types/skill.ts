export interface AxisScore {
  value: number;
  confidence: number;
  notes?: string;
  sources?: string[];
}

export interface SkillThumbnail {
  src: string;
  alt: string;
  attribution: string;
}

export interface SkillClip {
  src: string;
  poster: string;
  duration: number;
  attribution: string;
}

export interface SkillMedia {
  type: 'youtube';
  videoId: string;
  title: string;
}

export interface SkillSource {
  title: string;
  url?: string;
  author?: string;
  year?: number;
  type?: 'research' | 'institutional' | 'competition' | 'journalism' | 'community';
}

export type Category =
  | 'game'
  | 'language'
  | 'instrument'
  | 'sport'
  | 'trade'
  | 'academic'
  | 'physical'
  | 'performance'
  | 'survival'
  | 'technology';

export interface SkillScores {
  time_to_competence: AxisScore;
  time_to_expert: AxisScore;
  feedback_delay: AxisScore;
  failure_cost: AxisScore;
  cognitive_demand: AxisScore;
  physical_demand: AxisScore;
  prerequisite_knowledge: AxisScore;
  measurability: AxisScore;
  perishability: AxisScore;
  precision_required: AxisScore;
  ambiguity: AxisScore;
  instruction_dependency: AxisScore;
  environmental_variability: AxisScore;
  concurrent_skills: AxisScore;
  plateau_density: AxisScore;
  domain_evolution: AxisScore;
  observability: AxisScore;
  luck_variance: AxisScore;
  social_coordination: AxisScore;
}

export interface Skill {
  name: string;
  slug: string;
  category: Category;
  description: string;
  thumbnail: SkillThumbnail;
  clip?: SkillClip;
  media: SkillMedia[];
  sources: SkillSource[];
  scores: SkillScores;
  methodology_notes?: string;
  interactive?: string;
}

export interface RankedSkill extends Skill {
  rank: number;
  compositeScore: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  game: 'Games & Strategy',
  language: 'Languages',
  instrument: 'Instruments & Sound',
  sport: 'Sports & Athletics',
  trade: 'Trades & Crafts',
  academic: 'Academic & Intellectual',
  physical: 'Physical Feats',
  performance: 'Performance & Expression',
  survival: 'Survival & Fieldwork',
  technology: 'Technology & Engineering',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  game: '#8b5cf6',
  language: '#06b6d4',
  instrument: '#f59e0b',
  sport: '#22c55e',
  trade: '#ef4444',
  academic: '#3b82f6',
  physical: '#ec4899',
  performance: '#a855f7',
  survival: '#84cc16',
  technology: '#f97316',
};
