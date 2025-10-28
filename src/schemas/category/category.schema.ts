import z from 'zod';

export const addCategorySchema = z.object({
  categoryName: z.string(),
});
