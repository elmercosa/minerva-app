"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import AddMember from "@/components/organizations/members/addMember";
import EntityTable from "@/components/table/table";
import useUser from "@/hooks/useUser";
import { getUsersByOrganization } from "@/services/userService";

export default function Page() {
  const User: any = useUser();

  const [enableQuery, setEnableQuery] = useState(false);

  const GetMembers = useQuery({
    queryKey: "members",
    queryFn: () => getUsersByOrganization(User.data?.organization?.id || ""),
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
        <AddMember />
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-start justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Miembros</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Miembros</BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <EntityTable
        entities={GetMembers.data?.data || []}
        loading={GetMembers.isLoading}
        columns={columns}
        actions={null}
        filterFunction={filterFunction}
        tableHeader={tableHeader}
        entityName="miembro"
        entityNamePlural="miembros"
        needsUpdate={false}
        collection="organizations_users"
        deleteAttribute="user_id"
      />
    </div>
  );
}
