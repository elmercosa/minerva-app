"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { addEntity, getEntities, getEntity } from "@/services/entityService";

export default function Page({
  params,
}: {
  params: { sprint: string; organization: string; project: string };
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState("1");
  const [status, setStatus] = useState([] as any);
  const [priority, setPriority] = useState("low");

  const GetEntities: any = useQuery({
    queryKey: "project-sprints",
    queryFn: () => getEntity("sprints", params.sprint),
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

  const GetSprint: any = useQuery({
    queryKey: "sprints",
    queryFn: () => getEntity("sprints", params.sprint),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (GetStatuses.data) {
      setStatus(GetStatuses.data?.data?.[0]?.id);
    }
  }, [GetStatuses.data]);

  const newTask = async (formData: FormData) => {
    let sprint = GetSprint.data?.data?.id;
    const { newEntity, error } = await addEntity("tasks", {
      title,
      estimation,
      status_id: status,
      priority,
      description,
      project_id: params.project,
      sprint_id: sprint,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("El código de proyecto ya existe");
        return;
      } else {
        toast.error("Ha ocurrido un error al añadir la tarea");
      }
      return;
    } else {
      toast.success("Tarea creada correctamente");
      redirect(
        `/admin/organizations/${params.organization}/projects/${params.project}/sprints/${params.sprint}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-center justify-center w-full gap-4">
        <h1 className="text-5xl font-bold animate-in">Nueva tarea</h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Proyectos</BreadcrumbItem>
          <BreadcrumbItem> {GetProject.data?.data?.name} </BreadcrumbItem>
          <BreadcrumbItem> Sprints </BreadcrumbItem>
          <BreadcrumbItem>
            {" "}
            Sprint {GetEntities.data?.data?.number}{" "}
          </BreadcrumbItem>
          <BreadcrumbItem>Nueva tarea</BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <div className="w-6/12">
        <form
          action={newTask}
          className="flex flex-col w-full gap-4 p-5 bg-white rounded-xl"
        >
          <input type="hidden" name="project_id" value={params.project} />
          <Input
            type="text"
            label="Proyecto"
            placeholder="Proyecto"
            value={GetProject.data?.data?.name}
            labelPlacement="outside"
            isReadOnly
            isRequired
          />
          <Input
            type="text"
            label="Título"
            name="title"
            placeholder="Título de la tarea"
            labelPlacement="outside"
            value={title}
            onValueChange={setTitle}
            isRequired
          />
          <Textarea
            name="description"
            label="Descripción"
            labelPlacement="outside"
            value={description}
            onValueChange={setDescription}
            isRequired
          />
          <Input
            type="number"
            label="Estimación (horas)"
            name="estimation"
            min={1}
            placeholder="1 hora"
            labelPlacement="outside"
            isRequired
            value={estimation}
            onValueChange={setEstimation}
          />
          <Select
            label="Estado"
            name="status_id"
            labelPlacement="outside"
            placeholder={
              !GetStatuses.data?.data.length
                ? "No hay estados disponibles"
                : "Selecciona el estado"
            }
            selectionMode="single"
            onChange={(e) => setStatus(e.target.value)}
            isLoading={GetStatuses.isLoading}
            selectedKeys={[status]}
            value={[status]}
          >
            {GetStatuses.data?.data.map((status: any) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Prioridad"
            name="priority"
            labelPlacement="outside"
            placeholder="Selecciona la prioridad"
            selectionMode="single"
            onChange={(e) => setPriority(e.target.value)}
            selectedKeys={[priority]}
            value={[priority]}
          >
            <SelectItem key="low" value="low">
              Baja
            </SelectItem>
            <SelectItem key="medium" value="medium">
              Media
            </SelectItem>
            <SelectItem key="high" value="high">
              Alta
            </SelectItem>
          </Select>

          <Input
            type="text"
            label="Sprint"
            name="sprint_id"
            placeholder="Sprint"
            labelPlacement="outside"
            value={"Sprint " + GetSprint.data?.data?.number}
            isRequired
            isReadOnly
          />
          <Button
            color="primary"
            className="font-semibold text-white"
            type="submit"
          >
            Añadir
          </Button>
        </form>
      </div>
    </div>
  );
}
