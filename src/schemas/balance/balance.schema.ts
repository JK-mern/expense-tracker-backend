import z from 'zod';

export const updateBalanceSchema = z.object({
  balance: z.string(),
});
