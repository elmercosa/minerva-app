"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";

import useQuery from "@/hooks/useQuery";

export default function TeamsPage() {
  const { data, error, loading } = useQuery("projects", "*");

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-center justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Roles</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Equipos</BreadcrumbItem>
          <BreadcrumbItem>Roles</BreadcrumbItem>
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

      <Table aria-label="Example table with dynamic content">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody items={data ?? []} isLoading={loading}>
          {(item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
