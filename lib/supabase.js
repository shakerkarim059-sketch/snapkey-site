import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vbzecunsigkxeupyntyb.supabase.co";
const supabaseKey = "sb_publishable_JW8-6w5S05WboeDhl_nr_A_ndzS63D_";

export const supabase = createClient(supabaseUrl, supabaseKey);
