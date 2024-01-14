import { createClient } from "@/utils/supabase/client";

async function getNotTeamMembers(organization_id: string, id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*, organizations!organizations_users(*), teams(*)")
    .eq("organizations.id", organization_id)
    .eq("teams.id", id);

  const dataFiltered = data?.filter((user: any) => {
    return user.organizations.length && !user.teams.length;
  });

  return { dataFiltered, error };
}

export { getNotTeamMembers };
