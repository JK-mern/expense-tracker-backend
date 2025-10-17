import z from 'zod';

export const checkUserExist = z.object({
  email: z.email(),
});

export const createUser = z.object({
  currentBalance: z.string('Current balance is required'),
  email: z.email('Email is required'),
  id: z.string('id is required'),
  profilePicture: z.string().optional(),
  userName: z.string('username is required'),
});
