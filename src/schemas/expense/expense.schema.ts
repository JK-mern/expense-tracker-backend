import z from 'zod';

export const addNewExpenseSchema = z.object({
  amount: z.number(),
  categoryId: z.number(),
  date: z.string(),
  description: z.string().optional(),
});
