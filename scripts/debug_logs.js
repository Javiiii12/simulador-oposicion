
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://eykwcwgplldapzjnxuym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ds016pgeKw5Z3j-Icu0SUA_wdKEoIyx';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debugUser(userId) {
    console.log(`--- Debugging logs for ${userId} ---`);
    const { data: logs, error } = await supabase
        .from('access_logs')
        .select('*')
        .ilike('device_info', `%${userId}%`)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    logs.forEach(log => {
        console.log(`[${log.created_at}] ${log.device_info}`);
    });
}

const userToDebug = process.argv[2] || 'German';
debugUser(userToDebug);
