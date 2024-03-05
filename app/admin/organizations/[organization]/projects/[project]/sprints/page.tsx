"use client";
import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import AddProject from "@/components/project/addProject";
import ViewProject from "@/components/project/viewProject";
import AddSprint from "@/components/sprint/addSprint";
import ViewSprint from "@/components/sprint/viewSprint";
import EntityTable from "@/components/table/table";
import { getEntities, getEntity } from "@/services/entityService";

export default function Page({
  params,
}: {
  params: { project: string; organization: string };
}) {
  const GetSprints = useQuery({
    queryKey: "project-sprints",
    queryFn: () =>
      getEntities(
        "sprints",
        undefined,
        undefined,
        undefined,
        "project_id",
        params.project
      ),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const GetProject: any = useQuery({
    queryKey: "project",
    queryFn: () => getEntity("projects", params.project),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      key: "number",
      label: "Número",
    },
    {
      key: "start_date",
      label: "Fecha de inicio",
    },
    {
      key: "end_date",
      label: "Fecha de finalización",
    },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  const filterFunction = (entities: any, filterValue: string) => {
    return entities.filter((user: any) => {
      return (
        user?.number
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        user?.start_date
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        user?.end_date
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    });
  };

  const tableHeader = () => {
    return (
      <>
        <AddSprint projectId={params.project} />
      </>
    );
  };

  const actions = (id: string) => {
    return (
      <>
        <ViewSprint id={id} />
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-start justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Sprints</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Proyectos</BreadcrumbItem>
          <BreadcrumbItem> {GetProject.data?.data?.name} </BreadcrumbItem>
          <BreadcrumbItem> Sprints </BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <EntityTable
        entities={GetSprints.data?.data || []}
        loading={GetSprints.isLoading}
        columns={columns}
        actions={actions}
        filterFunction={filterFunction}
        tableHeader={tableHeader}
        entityName="sprint"
        entityNamePlural="sprints"
        needsUpdate={false}
        collection="sprints"
        deleteAttribute="id"
      />
    </div>
  );
}
