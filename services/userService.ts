import { createClient } from "@/utils/supabase/client";

async function getUser() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select()
    .eq("id", user?.id)
    .single();

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select()
    .eq("owner_id", user?.id)
    .single();

  const finalUser: any = user;

  if (user && users) {
    finalUser.data = users;
  }

  if (user && organization) {
    finalUser.organization = organization;
  }

  return user;
}

async function getUsersByOrganization(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*, organizations_users!inner(*)")
    .eq("organizations_users.organization_id", id);

  return { data, error };
}

async function getUsersTeam(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("teams").select("*, users (*)");

  return { data, error };
}

async function getUsersNotInOrganization(id: string) {
  const supabase = createClient();

  const { data: allUsers, error: allUsersError } = await supabase
    .from("users")
    .select("*");

  const { data: usersIn, error: usersInError } = await supabase
    .from("users")
    .select("*, organizations_users!inner(*)")
    .eq("organizations_users.organization_id", id);

  const data = allUsers?.filter((user: any) => {
    return !usersIn?.find((userIn: any) => userIn.id === user.id);
  });

  return { data, allUsersError };
}

async function addUserToOrganization(organization_id: string, user_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organizations_users")
    .insert([{ organization_id, user_id }])
    .select();

  console.log("error :>> ", error);
  return { data, error };
}

async function removeUserFromOrganization(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("organizations_users")
    .delete()
    .eq("user_id", id);

  return { error };
}

export {
  addUserToOrganization,
  getUser,
  getUsersByOrganization,
  getUsersNotInOrganization,
  getUsersTeam,
  removeUserFromOrganization,
};
