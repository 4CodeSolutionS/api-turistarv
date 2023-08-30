import { Pool } from 'pg';
import 'dotenv/config';

export const connectionPg = new Pool({
  connectionString: process.env.DATABASE_URL,
});
