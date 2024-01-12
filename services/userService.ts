import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

async function getUser() {
  "use server";
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", user?.id)
    .single();

  const finalUser: any = user;

  if (user && data) {
    finalUser.data = data;
  }

  console.log("error :>> ", error);

  return user;
}

export { getUser };
