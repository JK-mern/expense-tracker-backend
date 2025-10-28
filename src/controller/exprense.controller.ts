import {PrismaClient} from '@prisma/client';

import {Logger} from '../logger/logger.js';

export class ExpenseController {
  private logger = Logger.getInstance();
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
