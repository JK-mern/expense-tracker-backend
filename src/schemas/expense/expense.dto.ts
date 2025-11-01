import z from 'zod';

import type {addNewExpenseSchema} from './expense.schema.js';

export interface ExpenseFiltering {
  categoryId?: number;
  date?: {gte: Date; lt: Date};
  userId: string;
}

export type NewExpenseType = z.infer<typeof addNewExpenseSchema>;
