import z from 'zod';

import type {updateBalanceSchema} from './balance.schema.js';

export type UpdateBalanceType = z.infer<typeof updateBalanceSchema>;
