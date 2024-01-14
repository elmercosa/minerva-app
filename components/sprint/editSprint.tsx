"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { addEntity, getEntities } from "@/services/entityService";
import { getLastSprint } from "@/services/sprintsService";

export default function AddSprint({ projectId }: { projectId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [teams, setTeams] = useState([] as any);
  const [teamId, setTeamId] = useState("" as any);

  const GetNotMembers = useQuery({
    queryKey: "get-organization-members",
    queryFn: () => getEntities("teams"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const GetLastSprint: any = useQuery({
    queryKey: "last-sprint",
    queryFn: () => getLastSprint(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (GetNotMembers.data) {
      setTeams(GetNotMembers.data.data);
    }
  }, [GetNotMembers.data]);

  const add = async (formData: FormData) => {
    const number = formData.get("number") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const project_id = formData.get("project_id") as string;

    const { newEntity, error } = await addEntity("sprints", {
      number,
      start_date,
      end_date,
      project_id,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("El código de proyecto ya existe");
        return;
      } else {
        toast.error("Ha ocurrido un error al crear el sprint");
      }
      return;
    } else {
      toast.success("Sprint creado correctamente");
      window.location.reload();
    }
  };

  return (
    <>
      <Button
        className="font-semibold text-white bg-primary rounded-xl "
        startContent={<IconPlus size={20} className="font-semibold" />}
        onPress={onOpen}
      >
        Añadir sprint
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Añadir sprint
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col justify-center flex-1 gap-6 animate-in text-foreground"
                  action={add}
                >
                  <input type="hidden" name="project_id" value={projectId} />
                  <Input
                    label="Número"
                    name="number"
                    type="number"
                    placeholder={`${GetLastSprint.data?.data?.[0]?.number + 1}`}
                    labelPlacement="outside"
                    isRequired
                    description={`El último sprint fue el ${GetLastSprint.data?.data?.[0]?.number}`}
                  />
                  <Input
                    label="Fecha de inicio"
                    name="start_date"
                    type="date"
                    labelPlacement="outside"
                    placeholder="aaaa-mm-dd"
                    min={`${GetLastSprint.data?.data?.[0]?.end_date}`}
                    description={`El último sprint terminó el ${GetLastSprint.data?.data?.[0]?.end_date}`}
                    isRequired
                  />
                  <Input
                    label="Fecha de finalización"
                    name="end_date"
                    type="date"
                    min={`${GetLastSprint.data?.data?.[0]?.end_date}`}
                    placeholder="aaaa-mm-dd"
                    labelPlacement="outside"
                    isRequired
                  />
                  <Button
                    color="primary"
                    className="font-semibold text-white"
                    type="submit"
                  >
                    Añadir
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
