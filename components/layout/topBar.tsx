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

  return (
    <Navbar className="w-11/12 rounded-xl" maxWidth="full">
      <NavbarBrand>
        <div className="flex items-baseline justify-center gap-4">
          <p className="text-xl font-bold text-primary">Minerva</p>
          <OrganizationSelector />
        </div>
      </NavbarBrand>
      <NavbarContent className="hidden gap-6 sm:flex" justify="center">
        <NavbarItem isActive>
          <Link href="/admin">Inicio</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/admin/projects">
            Proyectos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Tareas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Incidencias
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Sprints
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/admin/teams">
            Equipos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
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
