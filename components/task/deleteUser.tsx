"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import { IconTrashFilled, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { removeEntity } from "@/services/entityService";

export default function DeleteEntity({
  id,

  entityName,
}: {
  id: string;
  entityName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteSlot, setDeleteSlot] = useState(false);

  const removeUser = useQuery({
    queryKey: "remove",
    queryFn: () => removeEntity("tasks_users", id, "user_id"),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: deleteSlot,
  });

  const handleRemoveSlot = (slot: any) => {
    setDeleteSlot(true);
  };

  useEffect(() => {
    if (removeUser.data && !removeUser.isLoading && removeUser.isFetched) {
      toast.success("Se ha eliminado correctamente.", {
        toastId: "delete entity",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    if (removeUser.isError) {
      toast.error("Ha ocurrido un error al borrar.");
    }
  }, [
    removeUser.data,
    removeUser.isError,
    removeUser.isLoading && removeUser.isFetched,
  ]);

  return (
    <>
      <Tooltip content={`Borrar ${entityName}`} color="danger">
        <Button
          startContent={<IconX size={14} stroke={2} />}
          onPress={() => setIsOpen(true)}
          size="sm"
          className="w-5 h-5 min-w-5"
          isIconOnly
          variant="light"
          color="default"
        ></Button>
      </Tooltip>
      <Modal isOpen={isOpen} hideCloseButton={true}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-xl">
            ¿Estás seguro?
          </ModalHeader>
          <ModalBody>
            <p>Este usuario será eliminado como responsable de la tarea.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpen(false)}
            >
              No
            </Button>
            <Button
              className="text-white shadow-md bg-primary"
              onPress={handleRemoveSlot}
              isLoading={removeUser.isLoading}
            >
              Sí
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
