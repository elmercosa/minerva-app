import { Button, Link, Tooltip } from "@nextui-org/react";
import { IconChecklist } from "@tabler/icons-react";

export default function ViewSprint({ id }: { id: string }) {
  const currentPath = window.location.pathname;
  return (
    <Tooltip content={`Ver sprint`}>
      <Button
        startContent={<IconChecklist size={16} />}
        href={`${currentPath}/${id}`}
        as={Link}
        size="sm"
        className="w-7 h-7 min-h-[28px] min-w-[28px]"
        isIconOnly
        variant="flat"
      ></Button>
    </Tooltip>
  );
}
