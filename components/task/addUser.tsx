"use client";
import {
  Button,
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
import { use, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { addEntity, getEntity } from "@/services/entityService";

export default function AddUser({
  teamId,
  resposibles,
  taskId,
}: {
  teamId: string;
  resposibles: any;
  taskId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [enableGetTeam, setEnableGetTeam] = useState(false);

  useEffect(() => {
    if (teamId) {
      setEnableGetTeam(true);
    }
  }, [teamId]);

  const GetTeam: any = useQuery({
    queryKey: "team",
    queryFn: () => getEntity("teams", teamId, "users"),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enableGetTeam,
  });

  useEffect(() => {
    if (GetTeam.data && resposibles) {
      const responsiblesIds = resposibles.map((responsible: any) => {
        return responsible.id;
      });
      const users = GetTeam.data.data.users.filter((user: any) => {
        return !responsiblesIds.includes(user.id);
      });

      setUsers(users);
    }
  }, [GetTeam.data, resposibles]);

  const [users, setUsers] = useState([] as any);
  const [value, setValue] = useState([] as any);

  const addMembers = async (closeModal: any) => {
    value.forEach((element: any) => {
      addEntity("tasks_users", { task_id: taskId, user_id: element });
    });
    toast.success("Miembros añadidos correctamente");
    closeModal();
    window.location.reload();
  };

  return (
    <>
      <Button
        isIconOnly
        startContent={<IconPlus size={14} />}
        size="sm"
        color="primary"
        variant="faded"
        className="w-6 h-6 min-w-6"
        onPress={onOpen}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Añadir miembros
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Usuarios"
                  placeholder={
                    !users?.length
                      ? "No hay usuarios disponibles"
                      : "Selecciona los usuarios"
                  }
                  selectionMode="multiple"
                  onSelectionChange={setValue}
                  isDisabled={!users?.length}
                >
                  {users?.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.user_name}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  className="font-semibold text-white"
                  isDisabled={!users?.length || !value}
                  onPress={() => {
                    addMembers(onClose);
                  }}
                >
                  Añadir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
