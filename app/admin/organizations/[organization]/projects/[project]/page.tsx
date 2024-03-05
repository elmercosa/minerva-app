"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { IconChevronDown, IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import EntityTable from "@/components/table/table";
import { getEntities, getEntity } from "@/services/entityService";

export default function Page({
  params,
}: {
  params: { project: string; organization: string };
}) {
  const GetProject: any = useQuery({
    queryKey: "project",
    queryFn: () => getEntity("projects", params.project, "sprints(*), teams"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const GetTasks: any = useQuery({
    queryKey: "tasks",
    queryFn: () =>
      getEntities(
        "tasks",
        "statuses(*), sprints",
        undefined,
        undefined,
        "project_id",
        params.project
      ),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [tasks, setTasks] = useState([] as any);
  const [visibleTasks, setVisibleTasks] = useState([] as any);

  useEffect(() => {
    if (GetTasks.data) {
      let tasks = GetTasks.data.data;
      tasks.forEach((task: any) => {
        task.sprint_name = task.sprints.number;
        task.status_name = task.statuses.name;
      });
      setTasks(tasks);
      setVisibleTasks(tasks);
    }
  }, [GetTasks.data]);

  const columns = [
    {
      key: "title",
      label: "Título",
    },
    {
      key: "status_name",
      label: "Estado",
    },
    {
      key: "sprint_name",
      label: "Sprint",
    },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  const filterFunction = (entities: any, filterValue: string) => {
    return entities.filter((user: any) => {
      return user?.title?.toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  const [selectedKeys, setSelectedKeys] = useState(new Set(["all"]));

  useEffect(() => {
    if (selectedKeys.has("all")) {
      setVisibleTasks(tasks);
    } else {
      setVisibleTasks(
        tasks.filter((task: any) => selectedKeys.has(task.sprints.id))
      );
    }
  }, [selectedKeys, tasks]);

  const tableHeader = () => {
    return (
      <>
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<IconChevronDown size={14} />}
              className="p-5 bg-white"
              variant="flat"
            >
              Sprint:{" "}
              {selectedKeys.has("all")
                ? "Todos"
                : GetProject.data?.data?.sprints?.find(
                    (sprint: any) =>
                      sprint.id === selectedKeys.values().next().value
                  )?.number}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Select sprint"
            closeOnSelect={true}
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys: any) => {
              setSelectedKeys(new Set(keys));
              return true as any;
            }}
          >
            <DropdownItem key="all">Todos</DropdownItem>
            {GetProject.data?.data?.sprints?.map((sprint: any) => (
              <DropdownItem key={sprint.id}>
                Sprint {sprint.number}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button
          as={Link}
          href={`/admin/organizations/${params.organization}/projects/${params.project}/sprints`}
          color="primary"
          className="font-semibold text-white"
          startContent={<IconEye />}
        >
          Ver sprints
        </Button>
      </>
    );
  };

  const actions = (id: string) => {
    return <></>;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-start justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">
          <Skeleton isLoaded={!GetProject.isLoading} className="rounded-lg">
            {GetProject.data?.data?.name}
          </Skeleton>
        </h1>
        <Skeleton isLoaded={!GetProject.isLoading} className="rounded-lg">
          <p>{GetProject.data?.data?.description}</p>
        </Skeleton>
        <Skeleton isLoaded={!GetProject.isLoading} className="rounded-lg">
          <p className="font-semibold">
            Equipo:{" "}
            <Link
              href={`/admin/organizations/${params.organization}/teams/${GetProject.data?.data?.teams?.id}`}
            >
              {GetProject.data?.data?.teams?.name}
            </Link>
          </p>
        </Skeleton>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Proyectos</BreadcrumbItem>
          <BreadcrumbItem>
            <Skeleton className="rounded-lg" isLoaded={!GetProject.isLoading}>
              {GetProject.data?.data?.name}
            </Skeleton>
          </BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <EntityTable
        entities={visibleTasks || []}
        loading={GetTasks.isLoading}
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
  );
}
