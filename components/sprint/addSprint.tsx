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
import { use, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { addEntity, getEntities } from "@/services/entityService";
import { getLastSprint } from "@/services/sprintsService";

export default function AddSprint({ projectId }: { projectId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [duration, setDuration] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const GetLastSprint: any = useQuery({
    queryKey: "last-sprint",
    queryFn: () => getLastSprint(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (GetLastSprint.data) {
      let start_date = new Date(GetLastSprint.data.data[0].end_date);
      start_date.setDate(start_date.getDate() + 1);
      setStartDate(
        `${start_date.getFullYear()}-${
          start_date.getMonth().toString().length === 1
            ? `0${start_date.getMonth() + 1}`
            : start_date.getMonth() + 1
        }-${start_date.getDate()}`
      );
    }
  }, [GetLastSprint.data]);

  useEffect(() => {
    if (GetLastSprint.data) {
      let end_date = new Date(startDate);
      end_date.setDate(end_date.getDate() + parseInt(duration) * 7);
      setEndDate(
        `${end_date.getFullYear()}-${
          end_date.getMonth().toString().length === 1
            ? `0${end_date.getMonth() + 1}`
            : end_date.getMonth() + 1
        }-${end_date.getDate()}`
      );
    }
  }, [GetLastSprint.data, duration, startDate]);

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
                    label="Semanas de duración"
                    name="duration"
                    type="number"
                    labelPlacement="outside"
                    placeholder="1"
                    min={1}
                    isRequired
                    value={duration}
                    onValueChange={(value) => setDuration(value)}
                  />
                  <Input
                    label="Fecha de inicio"
                    name="start_date"
                    type="text"
                    labelPlacement="outside"
                    placeholder="aaaa-mm-dd"
                    value={startDate}
                    isReadOnly
                    isRequired
                  />
                  <Input
                    label="Fecha de finalización"
                    name="end_date"
                    type="text"
                    placeholder="aaaa-mm-dd"
                    labelPlacement="outside"
                    isReadOnly
                    isRequired
                    value={endDate}
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
