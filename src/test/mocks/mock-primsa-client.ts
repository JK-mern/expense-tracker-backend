import type {PrismaClient} from '@prisma/client';

import {mockDeep, type MockProxy} from 'vitest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();
export type PrismaMock = MockProxy<PrismaClient>;
