import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

// Try multiple connection formats
const connectionStrings = [
  // Pooler connection (transaction mode)
  'postgresql://postgres.jlwwyfdcdjcoepqjpnvi:Diamitani217@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  // Pooler connection (session mode)
  'postgresql://postgres.jlwwyfdcdjcoepqjpnvi:Diamitani217@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  // Direct connection
  'postgresql://postgres:Diamitani217@db.jlwwyfdcdjcoepqjpnvi.supabase.co:5432/postgres',
];

async function tryConnect(connString) {
  const client = new Client({
    connectionString: connString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  return client;
}

async function runMigration() {
  let client = null;

  // Try each connection string
  for (const connStr of connectionStrings) {
    try {
      console.log(`Trying: ${connStr.replace(/:[^:@]+@/, ':****@')}...`);
      client = await tryConnect(connStr);
      console.log('Connected!\n');
      break;
    } catch (e) {
      console.log(`  Failed: ${e.message}\n`);
    }
  }

  if (!client) {
    console.log('\n❌ Could not connect to database.');
    console.log('\nPlease run the migration manually in Supabase SQL Editor:');
    console.log('1. Go to https://supabase.com/dashboard/project/jlwwyfdcdjcoepqjpnvi/sql');
    console.log('2. Copy the contents of supabase-schema.sql');
    console.log('3. Paste and click "Run"');
    return;
  }

  const sql = fs.readFileSync('./supabase-schema.sql', 'utf8');

  try {
    console.log('Running migration...');
    await client.query(sql);
    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.position) {
      const lines = sql.substring(0, parseInt(error.position)).split('\n');
      console.error(`  At line ${lines.length}: ${lines[lines.length - 1]}`);
    }
  } finally {
    await client.end();
  }
}

runMigration();
