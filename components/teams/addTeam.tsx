"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

import useUser from "@/hooks/useUser";
import { addEntity } from "@/services/entityService";

export default function AddTeam() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const User: any = useUser();

  useEffect(() => {
    if (User.data) {
    }
  }, [User.data]);

  const addTeam = async (formData: FormData) => {
    const description = formData.get("description") as string;
    const name = formData.get("name") as string;

    const { newEntity, error } = await addEntity("teams", {
      description,
      name,
    });

    if (error) {
      toast.error("Ha ocurrido un error al añadir el equipo");
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
        Añadir equipo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Añadir equipo
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col justify-center flex-1 gap-6 animate-in text-foreground"
                  action={addTeam}
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
