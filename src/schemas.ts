import { z } from 'zod';

// The single source of truth for valid statuses.
// Change these values here and they flow to the schemas, the seed, and the docs.
export const STATUSES = ['ready', 'in_progress', 'done'] as const;

export const ideaSchema = z.object({
  title: z
    .string()
    .min(1, 'title is required')
    .max(200, 'title must be 200 characters or fewer'),
  description: z.string().max(2000, 'description is too long').optional(),
  status: z.enum(STATUSES).default('ready'),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  sort: z.enum(['id', 'title', 'created_at']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc'),
  limit: z.coerce.number().int().positive().max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}