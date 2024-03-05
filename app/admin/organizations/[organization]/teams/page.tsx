"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import EntityTable from "@/components/table/table";
import AddTeam from "@/components/teams/addTeam";
import AddTeamMembers from "@/components/teams/addTeamMembers";
import useUser from "@/hooks/useUser";
import { getEntities } from "@/services/entityService";

export default function Page() {
  const User: any = useUser();

  const [enableQuery, setEnableQuery] = useState(false);

  const GetMembers = useQuery({
    queryKey: "teams",
    queryFn: () => getEntities("teams"),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enableQuery,
  });

  useEffect(() => {
    if (User.data) {
      setEnableQuery(true);
    }
  }, [User.data]);

  const columns = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "description",
      label: "Descripción",
    },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  const filterFunction = (entities: any, filterValue: string) => {
    return entities.filter((user: any) => {
      return (
        user?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        user?.description?.toLowerCase().includes(filterValue.toLowerCase())
      );
    });
  };

  const tableHeader = () => {
    return (
      <>
        <AddTeam />
      </>
    );
  };

  const actions = (id: string) => {
    return (
      <>
        <AddTeamMembers id={id} />
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-start justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Equipos</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Equipos</BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <EntityTable
        entities={GetMembers.data?.data || []}
        loading={GetMembers.isLoading}
        columns={columns}
        actions={actions}
        filterFunction={filterFunction}
        tableHeader={tableHeader}
        entityName="equipo"
        entityNamePlural="equipos"
        needsUpdate={false}
        collection="teams"
        deleteAttribute="id"
      />
    </div>
  );
}
