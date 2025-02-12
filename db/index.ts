import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {schema} from "@/db/schema";

config({ path: '.env' });

const client = postgres(process.env.SUPABASE_DATABASE_URL!);
export const db = drizzle({ client, schema });