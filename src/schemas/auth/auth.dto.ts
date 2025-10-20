import type z from 'zod';

import {checkUserExist, checkUserNameExist, createUser} from './index.js';

export type CheckUserExistType = z.infer<typeof checkUserExist>;
export type CreateUserType = z.infer<typeof createUser>;
export type UserNameExistType = z.infer<typeof checkUserNameExist>;
