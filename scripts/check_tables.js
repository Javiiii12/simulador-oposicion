
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ictintjdebutsjkbexpc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZBq95C7iXJxI4wkltK5YCA_45_zGPEW';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
    console.log('--- Checking usuarios_acceso ---');
    const { data: d1, error: e1 } = await supabase.from('usuarios_acceso').select('*').limit(1);
    console.log('Data:', d1);
    console.log('Error:', e1);

    console.log('\n--- Checking acceso_de_usuarios ---');
    const { data: d2, error: e2 } = await supabase.from('acceso_de_usuarios').select('*').limit(1);
    console.log('Data:', d2);
    console.log('Error:', e2);

    console.log('\n--- Checking access_logs ---');
    const { data: d3, error: e3 } = await supabase.from('access_logs').select('*').limit(1);
    console.log('Data:', d3);
    console.log('Error:', e3);

    console.log('\n--- Checking registros de acceso ---');
    const { data: d4, error: e4 } = await supabase.from('registros de acceso').select('*').limit(1);
    console.log('Data:', d4);
    console.log('Error:', e4);
}

checkTables();
