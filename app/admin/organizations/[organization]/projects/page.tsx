"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import AddProject from "@/components/project/addProject";
import ViewProject from "@/components/project/viewProject";
import EntityTable from "@/components/table/table";
import AddTeam from "@/components/teams/addTeam";
import AddTeamMembers from "@/components/teams/addTeamMembers";
import useUser from "@/hooks/useUser";
import { getEntities } from "@/services/entityService";

export default function Page() {
  const [projects, setProjects] = useState([] as any);

  const GetProject = useQuery({
    queryKey: "projects",
    queryFn: () => getEntities("projects", "teams"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (GetProject.data) {
      let projects = GetProject.data.data;
      projects.forEach((project: any) => {
        project.team_name = project.teams?.name;
      });
      setProjects(projects);
    }
  }, [GetProject.data]);

  const columns = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "code",
      label: "Código",
    },
    {
      key: "description",
      label: "Descripción",
    },
    {
      key: "team_name",
      label: "Equipo",
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
        <AddProject />
      </>
    );
  };

  const actions = (id: string) => {
    return (
      <>
        <ViewProject id={id} />
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-start justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Proyectos</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Proyectos</BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <EntityTable
        entities={projects || []}
        loading={GetProject.isLoading}
        columns={columns}
        actions={actions}
        filterFunction={filterFunction}
        tableHeader={tableHeader}
        entityName="proyecto"
        entityNamePlural="proyectos"
        needsUpdate={false}
        collection="projects"
        deleteAttribute="id"
      />
    </div>
  );
}
