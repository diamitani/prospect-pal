const { readFileSync } = require('fs');
const { join } = require('path');

// Using node-postgres if available, otherwise provide instructions
async function runMigration() {
  const migrationPath = join(__dirname, '../supabase/migrations/20260827_agent_sessions.sql');
  const sql = readFileSync(migrationPath, 'utf8');

  console.log('Migration SQL to execute:');
  console.log('=====================================');
  console.log(sql);
  console.log('=====================================\n');

  console.log('To run this migration:');
  console.log('1. Go to https://supabase.com/dashboard/project/jlwwyfdcdjcoepqjpnvi/sql/new');
  console.log('2. Paste the SQL above');
  console.log('3. Click "Run"');
  console.log('\nOr install psql and run:');
  console.log('PGPASSWORD=Diamitani217 psql -h db.jlwwyfdcdjcoepqjpnvi.supabase.co -U postgres -d postgres -p 5432 -f supabase/migrations/20260827_agent_sessions.sql');
}

runMigration();
