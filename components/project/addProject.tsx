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

export default function AddProject() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [teams, setTeams] = useState([] as any);
  const [teamId, setTeamId] = useState("" as any);

  const GetNotMembers = useQuery({
    queryKey: "get-organization-members",
    queryFn: () => getEntities("teams"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (GetNotMembers.data) {
      setTeams(GetNotMembers.data.data);
    }
  }, [GetNotMembers.data]);

  const add = async (formData: FormData) => {
    const description = formData.get("description") as string;
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    const { newEntity, error } = await addEntity("projects", {
      description,
      name,
      code,
      team_id: teamId,
    });

    if (error) {
      console.log("error :>> ", error);
      if (error.code === "23505") {
        toast.error("El código de proyecto ya existe");
        return;
      } else {
        toast.error("Ha ocurrido un error al añadir el proyecto");
      }
      return;
    } else {
      toast.success("Equipo creado correctamente");
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
        Añadir proyecto
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Añadir proyecto
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col justify-center flex-1 gap-6 animate-in text-foreground"
                  action={add}
                >
                  <Input
                    label="Nombre"
                    name="name"
                    type="text"
                    placeholder="Minerva"
                    labelPlacement="outside"
                    isRequired
                  />
                  <Input
                    label="Descripción"
                    name="description"
                    type="text"
                    placeholder="Este equipo es para..."
                    labelPlacement="outside"
                    isRequired
                  />
                  <Input
                    label="Código de proyecto"
                    name="code"
                    type="text"
                    placeholder="PROYECTO-1"
                    labelPlacement="outside"
                    isRequired
                  />
                  <Select
                    label="Equipo"
                    placeholder={
                      !teams.length
                        ? "No hay equipos disponibles"
                        : "Selecciona el equipo"
                    }
                    onChange={(e) => {
                      setTeamId(e.target.value);
                    }}
                    isLoading={GetNotMembers.isLoading}
                    isDisabled={!teams.length}
                  >
                    {teams.map((team: any) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    color="primary"
                    className="font-semibold text-white"
                    type="submit"
                    isDisabled={!teams.length || !teamId}
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
