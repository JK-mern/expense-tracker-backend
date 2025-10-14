import z from 'zod';

export const checkUserExist = z.object({
  email: z.email(),
});
