import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();
const NODE_ENV = ['development', 'production'];

const envSchema = z.object({
  DATABASE_URL: z.url('database url is required for prisma'),
  DIRECT_URL: z.url('direct db url is required for prisma'),
  NODE_ENV: z.enum(NODE_ENV),
  PORT: z.string('port number to run server is required').transform(Number),
  SUPABASE_SERVICE_ROLE_KEY: z.string('supabase service role key is required'),
  SUPABASE_URL: z.url('supabase url is required'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const formattedError = z.prettifyError(_env.error);
  console.error('Invalid environment variables', formattedError);
  process.exit(1);
}

export const env = _env.data;
