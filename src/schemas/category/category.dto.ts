import type z from 'zod';

import type {addCategorySchema} from './category.schema.js';

export type AddCategory = z.infer<typeof addCategorySchema>;
