import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const axisScore = z.object({
  value: z.number().int().min(0).max(10),
  confidence: z.number().min(0).max(1),
  notes: z.string().optional(),
  sources: z.array(z.string()).optional(),
});

const skillCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/skills' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    category: z.enum([
      'game',
      'language',
      'instrument',
      'sport',
      'trade',
      'academic',
      'physical',
      'performance',
      'survival',
      'technology',
    ]),
    description: z.string().max(800),
    thumbnail: z.object({
      src: z.string(),
      alt: z.string(),
      attribution: z.string(),
    }),
    clip: z
      .object({
        src: z.string(),
        poster: z.string(),
        duration: z.number(),
        attribution: z.string(),
      })
      .optional(),
    media: z
      .array(
        z.object({
          type: z.literal('youtube'),
          videoId: z.string(),
          title: z.string(),
        })
      )
      .default([]),
    sources: z.array(
      z.object({
        title: z.string(),
        url: z.string().url().optional(),
        author: z.string().optional(),
        year: z.number().optional(),
        type: z
          .enum(['research', 'institutional', 'competition', 'journalism', 'community', 'reference'])
          .optional(),
      })
    ),
    scores: z.object({
      time_to_competence: axisScore,
      time_to_expert: axisScore,
      feedback_delay: axisScore,
      failure_cost: axisScore,
      cognitive_demand: axisScore,
      physical_demand: axisScore,
      prerequisite_knowledge: axisScore,
      measurability: axisScore,
      perishability: axisScore,
      precision_required: axisScore,
      ambiguity: axisScore,
      instruction_dependency: axisScore,
      environmental_variability: axisScore,
      concurrent_skills: axisScore,
      plateau_density: axisScore,
      domain_evolution: axisScore,
      observability: axisScore,
      luck_variance: axisScore,
      social_coordination: axisScore,
    }),
    methodology_notes: z.string().optional(),
    interactive: z.string().optional(),
  }),
});

export const collections = { skills: skillCollection };
