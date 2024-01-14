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
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import useUser from "@/hooks/useUser";
import { addEntity, getEntities } from "@/services/entityService";
import { getNotTeamMembers } from "@/services/teamsService";
import {
  addUserToOrganization,
  getUsersNotInOrganization,
} from "@/services/userService";

export default function AddMember({ teamId }: { teamId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const User: any = useUser();

  useEffect(() => {
    if (User.data) {
      setEnableQuery(true);
    }
  }, [User.data]);

  const [enableQuery, setEnableQuery] = useState(false);

  const [users, setUsers] = useState([] as any);
  const [value, setValue] = useState([] as any);

  const GetNotMembers = useQuery({
    queryKey: "get-organization-members",
    queryFn: () => getNotTeamMembers(User.data?.organization?.id, teamId),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enableQuery,
  });

  useEffect(() => {
    if (GetNotMembers.data) {
      setUsers(GetNotMembers.data.dataFiltered);
    }
  }, [GetNotMembers.data]);

  const addMembers = async (closeModal: any) => {
    value.forEach((element: any) => {
      addEntity("teams_users", { team_id: teamId, user_id: element });
    });
    toast.success("Miembros añadidos correctamente");
    closeModal();
    window.location.reload();
  };

  return (
    <>
      <Button
        className="font-semibold text-white bg-primary rounded-xl "
        startContent={<IconPlus size={20} className="font-semibold" />}
        onPress={onOpen}
      >
        Añadir miembros
      </Button>
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
                    !users.length
                      ? "No hay usuarios disponibles"
                      : "Selecciona los usuarios"
                  }
                  selectionMode="multiple"
                  onSelectionChange={setValue}
                  isLoading={GetNotMembers.isLoading}
                  isDisabled={!users.length}
                >
                  {users.map((user: any) => (
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
                  isDisabled={!users.length || !value}
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
