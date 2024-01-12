"use client";
import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";

export default function TeamsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-center justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Equipos</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Equipos</BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <div className="flex items-center justify-center gap-4">
        <Button
          color="primary"
          as={Link}
          href="/admin/teams/roles"
          className="font-semibold text-white"
          startContent={<IconEdit size={16} />}
        >
          Editar roles
        </Button>
        <Button
          color="primary"
          className="font-semibold text-white"
          startContent={<IconPlus size={16} />}
        >
          Nuevo equipo
        </Button>
      </div>
    </div>
  );
}
