import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import {
  IconAlertTriangle,
  IconCategory2,
  IconChartTreemap,
  IconDiamond,
  IconListCheck,
  IconLogout,
  IconRun,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { IconMessage } from "@tabler/icons-react";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export default async function SideBar() {
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
    <aside className="flex flex-col justify-between w-64 h-screen border-r-2 bg-default-50 border-r-gray-200 dark:border-r-default-200">
      <div>
        <div className="flex items-center gap-2 px-6 h-14">
          <IconDiamond size={24} />
          <h2 className="text-2xl font-bold">Minerva</h2>
        </div>
        <nav className="flex flex-col gap-2 py-4 pl-6 font-semibold">
          <Link
            href={`/admin/organizations/${organization?.slug}`}
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
          >
            <IconChartTreemap
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Dashboard</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/projects`}
          >
            <IconCategory2
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Proyectos</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/tasks`}
          >
            <IconListCheck
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Tareas</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/issues`}
          >
            <IconAlertTriangle
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Incidencias</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/sprints`}
          >
            <IconRun
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Sprints</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/members`}
          >
            <IconUsers
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Miembros</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/teams`}
          >
            <IconUsersGroup
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Equipos</span>
          </Link>

          <Link
            className="gap-3 py-2 transition-all ease-in-out text-default-800 border-r-3 border-r-transparent hover:text-primary hover:border-r-primary group"
            href={`/admin/organizations/${organization?.slug}/chat`}
          >
            <IconMessage
              size={22}
              className="text-gray-400 group-hover:text-primary"
            />
            <span>Chat</span>
          </Link>
        </nav>
      </div>
      <div className="flex flex-col gap-2 px-6 py-4 font-semibold">
        <Link
          className="gap-3 py-2 transition-all ease-in-out text-default-800 hover:text-primary group "
          href={`/admin/organizations/${organization?.slug}/chat`}
        >
          <IconSettings
            size={22}
            className="text-gray-400 group-hover:text-primary"
          />
          <span>Configuración</span>
        </Link>
        <Link
          className="gap-3 py-2 transition-all ease-in-out text-default-800 hover:text-red-500 group"
          href={`/admin/organizations/${organization?.slug}/chat`}
        >
          <IconLogout
            size={22}
            className="text-gray-400 group-hover:text-red-500"
          />
          <span>Salir</span>
        </Link>
      </div>
    </aside>
  );
}
