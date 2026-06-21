import { z } from 'zod';

// Shape of a valid idea coming in via POST or PUT
export const ideaSchema = z.object({
  title: z
    .string()
    .min(1, 'title is required')
    .max(200, 'title must be 200 characters or fewer'),
  description: z.string().max(2000, 'description is too long').optional(),
  status: z.enum(['spark', 'lit', 'archived']).default('spark'),
});

// Shape of a valid :id URL parameter
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Turn a Zod error into a clean list of { field, message }
export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}