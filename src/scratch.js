const postgres = require('postgres');
const sql = postgres('postgresql://neondb_owner:npg_nEHLRsT5Ad1D@ep-shiny-wave-acyfw7qv-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function run() {
  try {
    const leads = await sql`SELECT responses FROM assessment_leads ORDER BY created_at DESC LIMIT 1`;
    const cap = await sql`SELECT responses FROM assessment_capacidades ORDER BY created_at DESC LIMIT 1`;
    console.log('Leads responses:', typeof leads[0]?.responses);
    console.log(JSON.stringify(leads[0]?.responses, null, 2));
    
    console.log('Capacidades responses:', typeof cap[0]?.responses);
    console.log(JSON.stringify(cap[0]?.responses, null, 2));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

run();
