"use client";

import {
  IconCalendarEvent,
  IconHome,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainMenu() {
  const pathname = usePathname();
  const menuClass =
    "flex items-center justify-start gap-4 px-4 py-3 font-semibold transition-all rounded-lg hover:text-white hover:bg-primary hover:shadow-md ";
  const active = menuClass + "bg-primary text-white";
  return (
    <div className="flex flex-col w-full gap-1 px-5">
      <Link
        href="/admin"
        className={pathname == "/admin" ? active : menuClass}
        replace
      >
        <IconHome size={20} />
        Inicio
      </Link>
      <Link
        href="/admin/users"
        className={pathname.includes("/admin/users") ? active : menuClass}
        replace
      >
        <IconUsersGroup size={20} />
        Usuarios
      </Link>
      <Link
        href="/admin/slots"
        className={pathname.includes("/admin/slots") ? active : menuClass}
        replace
      >
        <IconCalendarEvent size={20} />
        Citas
      </Link>
      <Link
        href="/admin/employees"
        className={pathname.includes("/admin/employees") ? active : menuClass}
        replace
      >
        <IconUsers size={20} />
        Empleados
      </Link>
    </div>
  );
}
