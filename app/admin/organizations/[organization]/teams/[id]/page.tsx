"use client";
import { BreadcrumbItem, Breadcrumbs, Skeleton } from "@nextui-org/react";
import { useQuery } from "react-query";

import EntityTable from "@/components/table/table";
import AddMember from "@/components/teams/addMember";
import useUser from "@/hooks/useUser";
import { getEntity } from "@/services/entityService";

export default function Page({ params }: { params: { id: string } }) {
  const User: any = useUser();

  const GetTeam: any = useQuery({
    queryKey: "team",
    queryFn: () => getEntity("teams", params.id, "users"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "surnames",
      label: "Apellidos",
    },
    {
      key: "user_name",
      label: "Nombre de usuario",
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
        user?.surnames?.toLowerCase().includes(filterValue.toLowerCase()) ||
        user?.user_name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    });
  };

  const tableHeader = () => {
    return (
      <>
        <AddMember teamId={params.id} />
      </>
    );
  };

  const actions = (id: string) => {
    return <></>;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-center justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">
          <Skeleton isLoaded={!GetTeam.isLoading} className="rounded-lg">
            {GetTeam.data?.data?.name}
          </Skeleton>
        </h1>
        <Skeleton isLoaded={!GetTeam.isLoading} className="rounded-lg">
          <p>{GetTeam.data?.data?.description}</p>
        </Skeleton>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Equipos</BreadcrumbItem>
          <BreadcrumbItem>
            <Skeleton className="rounded-lg" isLoaded={!GetTeam.isLoading}>
              {GetTeam.data?.data?.name}
            </Skeleton>
          </BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <div className="w-10/12">
        <EntityTable
          title="Miembros"
          entities={GetTeam.data?.data.users || []}
          loading={GetTeam.isLoading}
          columns={columns}
          actions={actions}
          filterFunction={filterFunction}
          tableHeader={tableHeader}
          entityName="miembro"
          entityNamePlural="miembros"
          needsUpdate={false}
          collection="teams_users"
          deleteAttribute="user_id"
        />
      </div>
    </div>
  );
}
