import fs from 'fs/promises';
import { sql } from '@vercel/postgres';

const schema = await fs.readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
await sql.unsafe(schema);
console.log('Database schema applied');
