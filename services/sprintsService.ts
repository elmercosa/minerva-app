import { createClient } from "@/utils/supabase/client";

async function getLastSprint(project_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sprints")
    .select("*")
    .eq("project_id", project_id)
    .order("number", { ascending: false })
    .limit(1);

  return { data, error };
}

export { getLastSprint };
