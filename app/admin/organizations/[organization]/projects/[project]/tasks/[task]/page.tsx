"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import AddUser from "@/components/task/addUser";
import DeleteEntity from "@/components/task/deleteUser";
import useUser from "@/hooks/useUser";
import {
  addEntity,
  getEntities,
  getEntity,
  updateEntity,
} from "@/services/entityService";

export default function Page({
  params,
}: {
  params: {
    sprint: string;
    organization: string;
    project: string;
    task: string;
  };
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState("1");
  const [status, setStatus] = useState([] as any);
  const [priority, setPriority] = useState("low");
  const [sprint, setSprint] = useState([] as any);

  const [editMode, setEditMode] = useState(false);

  const [comment, setComment] = useState("");

  const User = useUser();

  const GetEntity: any = useQuery({
    queryKey: "task",
    queryFn: () =>
      getEntity("tasks", params.task, "sprints(*), comments(*), users"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (GetEntity.data) {
      setTitle(GetEntity.data.data.title);
      setDescription(GetEntity.data.data.description);
      setEstimation(GetEntity.data.data.estimation);
      setStatus(GetEntity.data.data.status_id);
      setPriority(GetEntity.data.data.priority);
      setSprint(GetEntity.data.data.sprint_id);
      setEnableQuery(true);
    }
  }, [GetEntity.data]);

  const [enableQuery, setEnableQuery] = useState(false);

  const GetProject: any = useQuery({
    queryKey: "project",
    queryFn: () =>
      getEntity("projects", GetEntity.data?.data.project_id, "teams"),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enableQuery,
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
    queryFn: () => getEntity("sprints", sprint),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enableQuery,
  });

  const [enableGetTeam, setEnableGetTeam] = useState(false);

  useEffect(() => {
    if (GetProject.data) {
      setEnableGetTeam(true);
    }
  }, [GetProject.data]);

  const GetTeam: any = useQuery({
    queryKey: "team",
    queryFn: () => getEntity("teams", GetProject.data?.data?.teams.id, "users"),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enableGetTeam,
  });

  const updateTask = async () => {
    const { updatedEntity, error } = await updateEntity("tasks", params.task, {
      title,
      estimation,
      status_id: status,
      priority,
      description,
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
      window.location.reload();
    }
  };

  const sendComment = async () => {
    const { newEntity, error } = await addEntity("comments", {
      comment,
      task_id: params.task,
      user_id: User.data?.id,
    });

    if (error) {
      toast.error("Ha ocurrido un error al añadir el comentario");
      return;
    } else {
      toast.success("Comentario enviado");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <header className="flex flex-col items-center justify-center w-full gap-4">
        <h1 className="text-5xl font-bold text-center animate-in">
          {GetEntity.data?.data?.title}
        </h1>
        <Breadcrumbs>
          <BreadcrumbItem>Inicio</BreadcrumbItem>
          <BreadcrumbItem>Proyectos</BreadcrumbItem>
          <BreadcrumbItem> {GetProject.data?.data?.name} </BreadcrumbItem>
          <BreadcrumbItem> Tareas </BreadcrumbItem>
          <BreadcrumbItem>{GetEntity.data?.data?.title}</BreadcrumbItem>
        </Breadcrumbs>
      </header>
      <div className="flex flex-col w-6/12 gap-4">
        <form
          action={updateTask}
          className="relative flex flex-col w-full gap-4 px-5 pt-8 pb-5 bg-white rounded-xl"
        >
          <Button
            isIconOnly
            startContent={<IconEdit size={14} />}
            size="sm"
            className="absolute top-1 right-1"
            color={editMode ? "primary" : "default"}
            variant="light"
            onPress={() => setEditMode(!editMode)}
          />
          <div className="flex gap-4">
            <Input
              type="text"
              label="Proyecto"
              placeholder="Proyecto"
              value={GetProject.data?.data?.name}
              labelPlacement="outside"
              isReadOnly
            />
            <Input
              type="text"
              label="Sprint"
              name="sprint_id"
              placeholder="Sprint"
              labelPlacement="outside"
              value={"Sprint " + GetSprint.data?.data?.number}
              isReadOnly
            />
          </div>

          <div className="flex gap-4">
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
              className="w-1/2 "
              isDisabled={!editMode}
            >
              {GetStatuses.data?.data.map((status: any) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </Select>
            <div className="flex w-1/2 gap-2">
              <Select
                label="Prioridad"
                name="priority"
                labelPlacement="outside"
                placeholder="Selecciona la prioridad"
                selectionMode="single"
                onChange={(e) => setPriority(e.target.value)}
                selectedKeys={[priority]}
                value={[priority]}
                isDisabled={!editMode}
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
                type="number"
                label="Estimación (horas)"
                name="estimation"
                min={1}
                placeholder="1 hora"
                labelPlacement="outside"
                isReadOnly={!editMode}
                isRequired
                value={estimation}
                onValueChange={setEstimation}
                isDisabled={!editMode}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm">Responsables</h2>
            <div className="flex items-center gap-2">
              {GetEntity.data?.data?.users.map((user: any) => (
                <Chip
                  key={user.id}
                  color="primary"
                  variant="faded"
                  endContent={
                    <DeleteEntity id={user.id} entityName="responsable" />
                  }
                >
                  {user.user_name}
                </Chip>
              ))}
              <AddUser
                teamId={GetTeam.data?.data?.id}
                resposibles={GetEntity.data?.data?.users}
                taskId={params.task}
              />
            </div>
          </div>
          <Input
            type="text"
            label="Título"
            name="title"
            placeholder="Título de la tarea"
            labelPlacement="outside"
            value={title}
            onValueChange={setTitle}
            isReadOnly={!editMode}
            isRequired
          />
          <Textarea
            name="description"
            label="Descripción"
            labelPlacement="outside"
            value={description}
            onValueChange={setDescription}
            isReadOnly={!editMode}
            isRequired
          />
          {editMode && (
            <div className="flex gap-2">
              <Button
                color="danger"
                className="w-full font-semibold text-white"
                type="submit"
              >
                Eliminar
              </Button>
              <Button
                color="primary"
                className="w-full font-semibold text-white"
                type="submit"
              >
                Guardar
              </Button>
            </div>
          )}
        </form>
        <div className="flex flex-col gap-4 p-5 bg-white rounded-xl">
          <h2 className="font-semibold">Comentarios</h2>
          <div className="flex flex-col gap-4">
            {GetEntity.data?.data?.comments.map((comment: any) => (
              <div key={comment.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-semibold">
                    {
                      GetTeam.data?.data?.users.find(
                        (user: any) => user.id === comment.user_id
                      ).user_name
                    }
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="p-4 bg-gray-100 rounded-xl">{comment.comment}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end justify-center gap-4">
            <Textarea
              type="text"
              label="Nuevo comentario"
              placeholder="Escribe un comentario"
              className="w-full"
              labelPlacement="outside"
              value={comment}
              onValueChange={setComment}
            />
            <Button
              startContent={<IconDeviceFloppy size={16} />}
              color="primary"
              className="font-semibold text-white"
              onPress={sendComment}
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
