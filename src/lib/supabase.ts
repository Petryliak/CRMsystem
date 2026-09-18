import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyogpficsunnkgvitfgc.supabase.co';
const supabaseAnonKey = 'sb_publishable_vYAjKJAsGkQSu5XoCqDo_w_vMm1Dr9Z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);