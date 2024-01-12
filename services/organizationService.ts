import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

async function getOrganizationByUser(id: string) {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("organizations")
    .select()
    .eq("owner_id", id)
    .single();

  return { data, error };
}

export { getOrganizationByUser };
