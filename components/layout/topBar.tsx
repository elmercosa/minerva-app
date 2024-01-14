import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

import OrganizationSelector from "./organizationSelector";

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
    <Navbar className="w-11/12 rounded-xl" maxWidth="full">
      <NavbarBrand>
        <div className="flex items-baseline justify-center gap-4">
          <p className="">
            <span className="text-xl font-bold text-primary"> Minerva/</span>
            <span className="text-sm font-semibold text-black">
              {organization?.name}
            </span>
          </p>
        </div>
      </NavbarBrand>
      <NavbarContent className="hidden gap-6 sm:flex" justify="center">
        <NavbarItem isActive>
          <Link href={`/admin/organizations/${organization?.slug}`}>
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/projects`}
          >
            Proyectos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/tasks`}
          >
            Tareas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/issues`}
          >
            Incidencias
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/sprints`}
          >
            Sprints
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/members`}
          >
            Miembros
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/teams`}
          >
            Equipos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href={`/admin/organizations/${organization?.slug}/chat`}
          >
            Chat
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="font-semibold">{data?.user_name}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
