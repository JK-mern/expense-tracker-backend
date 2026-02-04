export const MockCategories = [
  {
    id: 1,
    name: 'Shopping',
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Entertainment',
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  },
];

export const MockCategoryWiseExpense = [
  {amount: 2000, categoryName: 'Shopping'},
  {amount: 5000, categoryName: 'Entertainment'},
];

export const MockGroupByExpense = [
  {
    _sum: {amount: 2000},
    categoryId: 1,
  },
  {
    _sum: {amount: 5000},
    categoryId: 2,
  },
];
