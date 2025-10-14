import type z from 'zod';

import {checkUserExist} from './index.js';

export type CheckUserExistType = z.infer<typeof checkUserExist>;
