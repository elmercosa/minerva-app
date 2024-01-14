"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "react-query";

import { getEntities, getEntity } from "@/services/entityService";

export default function Page({
  params,
}: {
  params: { sprint: string; organization: string; project: string };
}) {
  const GetEntities: any = useQuery({
    queryKey: "project-sprints",
    queryFn: () => getEntity("sprints", params.sprint, "tasks"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const GetProject: any = useQuery({
    queryKey: "project",
    queryFn: () => getEntity("projects", params.project),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const GetStatuses: any = useQuery({
    queryKey: "statuses",
    queryFn: () =>
      getEntities(
        "statuses",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "order",
        "asc"
      ),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-center justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">
          <Skeleton isLoaded={!GetEntities.isLoading} className="rounded-lg">
            Sprint {GetEntities.data?.data?.number}
          </Skeleton>
        </h1>
        <div className="flex gap-2">
          <Button
            as={Link}
            href={`/admin/organizations/${params.organization}/projects/${params.project}/sprints/${params.sprint}/new-task`}
            color="primary"
            className="font-semibold text-white"
            startContent={<IconPlus size={18} />}
          >
            Crear tarea
          </Button>
          <Button
            as={Link}
            href={`/admin/organizations/${params.organization}/projects/${params.project}/sprints/${params.sprint}/new-task`}
            color="primary"
            className="font-semibold text-white"
            startContent={<IconPlus size={18} />}
          >
            Añadir tarea
          </Button>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Proyectos</BreadcrumbItem>
          <BreadcrumbItem> {GetProject.data?.data?.name} </BreadcrumbItem>
          <BreadcrumbItem> Sprints </BreadcrumbItem>
          <BreadcrumbItem>
            {" "}
            Sprint {GetEntities.data?.data?.number}{" "}
          </BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <div className="grid items-start w-full grid-cols-8 gap-1">
        {GetStatuses.data?.data.map((status: any) => {
          return (
            <div
              key={status.id}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="flex items-center justify-center w-full py-2 bg-white bg-orange-100 rounded-xl">
                <span className="font-semibold">{status.name}</span>
              </div>
              <div className="flex flex-col w-full gap-2">
                {GetEntities.data?.data?.tasks
                  ?.filter((task: any) => task.status_id === status.id)
                  .map((task: any) => {
                    return (
                      <Link
                        href={`/admin/organizations/${params.organization}/projects/${params.project}/tasks/${task.id}`}
                        key={task.id}
                        className="flex items-center justify-center w-full py-2 text-center bg-white rounded-xl"
                      >
                        <span className="font-semibold">{task.title}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
