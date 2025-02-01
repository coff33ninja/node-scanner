import { createLovableClient } from 'lovable';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const lovable = createLovableClient({
  supabase,
  config: {
    redirectUrls: {
      signIn: 'http://localhost:5173/auth/callback',
      signUp: 'http://localhost:5173/auth/callback',
    },
    providers: {
      // Add any OAuth providers you want to use
      // google: true,
      // github: true,
    },
  },
});