import z from 'zod';

export const addNewExpenseSchema = z.object({
  amount: z.number(),
  categoryId: z.number(),
  description: z.string().optional(),
});
