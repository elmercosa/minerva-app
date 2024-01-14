import { Button, Link, Tooltip } from "@nextui-org/react";
import { IconEdit } from "@tabler/icons-react";

export default function EditEntity({
  id,
  endpoint,
  entityName,
}: {
  id: string;
  endpoint: string;
  entityName: string;
}) {
  return (
    <Tooltip content={`Editar ${entityName}`}>
      <Button
        startContent={<IconEdit size={16} />}
        as={Link}
        href={`/admin/${endpoint}/edit/${id}`}
        size="sm"
        className="w-7 h-7 min-h-[28px] min-w-[28px]"
        isIconOnly
        variant="flat"
      ></Button>
    </Tooltip>
  );
}
