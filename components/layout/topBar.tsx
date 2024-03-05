import { Avatar, Button, Input } from "@nextui-org/react";
import { IconBell, IconMoon, IconSearch, IconUser } from "@tabler/icons-react";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

import { ThemeSwitcher } from "./themeSwitcher";

export default async function TopBar() {
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

  const { data: organization, error: organization_error } = await supabase
    .from("organizations")
    .select()
    .eq("owner_id", user?.id)
    .single();

  return (
    <div className="flex items-center justify-between w-full px-10 py-2 border-b-2 bg-default-50 h-14 border-b-gray-200 dark:border-b-default-200">
      <div className="flex items-center justify-center gap-2">
        <Avatar
          size="sm"
          icon={<IconUser size={18} />}
          classNames={{
            base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
            icon: "text-black/80",
          }}
        />
        <span className="font-bold">Hola, Elmer Cortez</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Input
          isClearable
          size="sm"
          type="text"
          placeholder="Buscar"
          labelPlacement="outside"
          startContent={
            <IconSearch className="pointer-events-none text-default-400" />
          }
        />
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            radius="full"
            isIconOnly
            variant="light"
            startContent={<IconBell size={20} className="text-default-600" />}
          />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
