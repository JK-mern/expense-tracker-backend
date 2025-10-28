import z from 'zod';

import type {addNewExpenseSchema} from './expense.schema.js';

export type NewExpenseType = z.infer<typeof addNewExpenseSchema>;
