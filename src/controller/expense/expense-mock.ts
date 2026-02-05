import {Decimal} from '@prisma/client/runtime/library';
import {MockUser} from '../auth/mock-auth.js';

export const CreateExpenseMock = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: MockUser.id,
  balanceId: '101',
  amount: new Decimal(1000),
  categoryId: 1,
  date: new Date(),
  description: 'Watching a movie',
};

export const CreateBalanceMock = {
  id: '101',
  userId: MockUser.id,
  amount: new Decimal('1000'),
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const ExpenseMockResult = [
  {
    id: 1,
    amount: new Decimal(1000),
    date: new Date(),
    description: 'Watching a movie',
    balance: {
      amount: new Decimal(5000),
    },
    category: {
      name: 'Entertainment',
    },
    userId: MockUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 101,
    balanceId: '101',
  },
];

export const MockFormattedResult = [
  {
    amount: new Decimal(1000),
    balanceAmount: new Decimal(5000),
    categoryName: 'Entertainment',
    date: new Date(),
    description: 'Watching a movie',
    id: ExpenseMockResult[0]?.id,
  },
];

export const expenseSelect = {
  amount: true,
  balance: {
    select: {
      amount: true,
    },
  },
  category: {
    select: {
      name: true,
    },
  },
  date: true,
  description: true,
  id: true,
};
