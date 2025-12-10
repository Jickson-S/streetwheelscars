// src/testSupabase.js
import supabase from './supabaseClient.js';

async function testConnection() {
  const { data, error } = await supabase.from('User').select('*').limit(1);
  if (error) {
    console.error('Supabase query error:', error);
  } else {
    console.log('Supabase connection OK — sample:', data);
  }
}

testConnection();
