import z from 'zod';

export const checkUserExist = z.object({
  email: z.email(),
});

export const createUser = z.object({
  currentBalance: z.string(),
  email: z.email(),
  id: z.string(),
  profilePicture: z.string().optional(),
  userName: z.string(),
});
