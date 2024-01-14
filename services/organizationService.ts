import { createClient } from "@/utils/supabase/client";

async function getOrganizationByUser(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("organizations").select("*");

  return { data, error };
}

export { getOrganizationByUser };
