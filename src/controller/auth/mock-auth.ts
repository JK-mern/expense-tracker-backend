import {Decimal} from '@prisma/client/runtime/library';

export const MockUser = {
  createdAt: new Date(),
  currentBalance: new Decimal('450.20'),
  deletedAt: null,
  email: 'test@gmail.com',
  id: '1',
  isProfileCompleted: false,
  profilePicture: null,
  updatedAt: new Date(),
  userName: 'test-user',
};
